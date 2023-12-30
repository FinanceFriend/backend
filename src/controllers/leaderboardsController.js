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

const getCountryLeaderboard = async (req, res) => {
  try {
    const { country } = req.params;

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
      message: "Error retrieving country-specific leaderboard",
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

const getAgeLeaderboard = async (req, res) => {
  try {
    const age = parseInt(req.params.age);

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
        $match: { age },
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
      message: "Error retrieving age-specific leaderboard",
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

module.exports = {
  getGeneralLeaderboard,
  getGeneralLeaderboardByUser,
  getCountryLeaderboard,
  getCountryLeaderboardByUser,
  getAgeLeaderboard,
  getAgeLeaderboardByUser
};
