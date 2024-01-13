require("mongoose");
const { getAge } = require("../utilities/dateCalc");
const Stats = require("../models/stats");
const User = require("../models/user");

const getLeaderboard = async (req, res) => {
  try {
    const { age, country } = req.query;

    const usersWithStats = await getUsersWithStats(age, country);

    let lastPoints = null;
    let lastRank = 0;
    let rank = 0;
    const leaderboard = usersWithStats.map((user) => {
      if (user.totalPoints !== lastPoints) {
        lastPoints = user.totalPoints;
        rank = ++lastRank;
      } else {
        rank = lastRank;
      }

      return {
        username: user.username,
        countryOfOrigin: user.countryOfOrigin,
        age: user.userAge,
        totalPoints: user.totalPoints,
        rank: rank,
      };
    });

    res.status(200).json({ success: true, leaderboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error retrieving leaderboard",
      error: err.message,
    });
  }
};

const getLeaderboardByUser = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userAge = getAge(user.dateOfBirth);
    
    const generalUserStats = await getUsersWithStats(
      undefined,
      undefined,
      false
    );
    const ageUserStats = await getUsersWithStats(userAge, undefined, false);
    const countryUserStats = await getUsersWithStats(
      undefined,
      user.countryOfOrigin,
      false
    );

    const generalRank = findUserRank(generalUserStats, username);
    const ageRank = findUserRank(ageUserStats, username);
    const countryRank = findUserRank(countryUserStats, username);

    const userData = {
      username,
      age: userAge,
      country: user.countryOfOrigin,
      generalRank,
      ageRank,
      countryRank
    };

    res.status(200).json({ success: true, userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error retrieving user leaderboard data",
      error: err.message,
    });
  }
};

async function getUsersWithStats(age, country, useLimit = true) {
  let matchStage = {};

  if (age) {
    matchStage.userAge = parseInt(age);
  }

  if (country) {
    matchStage.countryOfOrigin = country;
  }

  try {
    const aggregationPipeline = [
      {
        $lookup: {
          from: Stats.collection.name,
          localField: "username",
          foreignField: "username",
          as: "stats",
        },
      },
      {
        $unwind: "$stats",
      },
      {
        $project: {
          username: 1,
          countryOfOrigin: 1,
          userAge: {
            $floor: {
              $divide: [
                { $subtract: [new Date(), "$dateOfBirth"] },
                365 * 24 * 60 * 60 * 1000,
              ],
            },
          },
          totalPoints: { $sum: "$stats.points" },
        },
      },
      {
        $match: matchStage,
      },
      {
        $sort: { totalPoints: -1 },
      },
    ];

    if (useLimit) {
      aggregationPipeline.push({ $limit: 100 });
    }

    const usersWithStats = await User.aggregate(aggregationPipeline);

    return usersWithStats;
  } catch (err) {
    console.error(err);
    throw new Error("Error retrieving users with stats");
  }
}

function findUserRank(usersWithStats, username) {
  let lastPoints = null;
  let rank = 0;
  let userRank = -1;

  usersWithStats.forEach((user) => {
    if (user.totalPoints !== lastPoints) {
      lastPoints = user.totalPoints;
      rank++;
    }
    if (user.username === username) {
      userRank = rank;
    }
  });

  return userRank;
}

module.exports = {
  getLeaderboard,
  getLeaderboardByUser,
};
