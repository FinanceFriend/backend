require("mongoose");
const Stats = require("../models/stats");
const User = require("../models/user");

const getGeneralLeaderboardByUser = async (req, res) => {
  try {
    const { username } = req.params;

    const usersWithStats = await User.aggregate([
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
          age: {
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
        $sort: { totalPoints: -1 },
      },
    ]);

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

    if (userRank === -1) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userStats = usersWithStats.find((u) => u.username === username);

    const userData = {
      ...userStats,
      rank: userRank,
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

const getCountryLeaderboardByUser = async (req, res) => {
  try {
    const { country, username } = req.params;

    const usersWithStats = await User.aggregate([
      {
        $match: { countryOfOrigin: country },
      },
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
          age: {
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
        $sort: { totalPoints: -1 },
      },
    ]);

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

    if (userRank === -1) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userStats = usersWithStats.find((u) => u.username === username);

    const userData = {
      ...userStats,
      rank: userRank,
    };

    res.status(200).json({ success: true, userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error retrieving user data for country-specific leaderboard",
      error: err.message,
    });
  }
};

const getAgeLeaderboardByUser = async (req, res) => {
  try {
    const { age, username } = req.params;

    const usersWithStats = await User.aggregate([
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
        $match: { userAge: parseInt(age) },
      },
      {
        $sort: { totalPoints: -1 },
      },
    ]);

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

    if (userRank === -1) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userStats = usersWithStats.find((u) => u.username === username);

    const userData = {
      ...userStats,
      rank: userRank,
    };

    res.status(200).json({ success: true, userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error retrieving user data for age-specific leaderboard",
      error: err.message,
    });
  }
};

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

async function getUsersWithStats(age, country) {
  let matchStage = {};

  if (age) {
      matchStage.userAge = parseInt(age);
  }

  if (country) {
      matchStage.countryOfOrigin = country;
  }

  try {
      const usersWithStats = await User.aggregate([
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
          {
              $limit: 100,
          },
      ]);

      return usersWithStats;
  } catch (err) {
      console.error(err);
      throw new Error("Error retrieving users with stats");
  }
}

module.exports = {
  getLeaderboard,
  getGeneralLeaderboardByUser,
  getCountryLeaderboardByUser,
  getAgeLeaderboardByUser,
};
