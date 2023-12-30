require("mongoose");
const Stats = require("../models/stats");
const User = require("../models/user");

const getGeneralLeaderboard = async (req, res) => {
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
      {
        $limit: 100,
      },
    ]);

    let lastPoints = null;
    let lastRank = 0;
    let rank = 0;
    const leaderboard = usersWithStats.map((user) => {
      if (user.totalPoints !== lastPoints) {
        lastPoints = user.totalPoints;
        rank = ++lastRank;
      } else {
        lastRank = rank;
      }

      return {
        username: user.username,
        countryOfOrigin: user.countryOfOrigin,
        age: user.age,
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

module.exports = {
  getGeneralLeaderboard,
};
