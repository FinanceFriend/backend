require("mongoose");
const Stats = require("../models/stats");

const initializeStats = async (username) => {
  try {
    const newStats = new Stats({
      username,
      completionPercentages: new Array(6).fill(0),
      points: new Array(6).fill(0),
      correctAnswers: 0,
      incorrectAnswers: 0,
    });

    await newStats.save();
  } catch (err) {
    console.error("Error initializing stats:", err);
    throw err;
  }
};

const deleteStats = async (username) => {
  try {
    await Stats.deleteOne({ username: username });
    console.log(`Stats for user ${username} deleted successfully.`);
  } catch (err) {
    console.error("Error deleting stats:", err);
    throw err;
  }
};

module.exports = {
  initializeStats,
  deleteStats,
};
