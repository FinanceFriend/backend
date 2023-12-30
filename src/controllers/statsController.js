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

const getStats = async (req, res) => {
  try {
    const { username } = req.params;
    const stats = await Stats.findOne({ username: username });

    if (!stats) {
      return res
        .status(404)
        .json({ success: false, message: "Stats not found" });
    }

    const statsResponse = createStatsResponse(stats);

    res.status(200).json({ success: true, statsResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error retrieving stats",
      error: err.message,
    });
  }
};

const updateStats = async (req, res) => {
  try {
    const { username } = req.params;
    const updateData = req.body;

    const updatedStats = await Stats.findOneAndUpdate(
      { username: username },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedStats) {
      return res.status(404).json({
        success: false,
        message: "Stats not found for the given username",
      });
    }

    const statsResponse = createStatsResponse(updatedStats);

    res.status(200).json({
      success: true,
      message: "Stats updated successfully",
      data: statsResponse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error updating stats",
      error: err.message,
    });
  }
};

function createStatsResponse(stats) {
  const totalCompletion =
    stats.completionPercentages.length > 0
      ? stats.completionPercentages.reduce((a, b) => a + b, 0) /
        stats.completionPercentages.length
      : 0;

  const totalPoints = stats.points.reduce((a, b) => a + b, 0);

  const totalAnswers = stats.correctAnswers + stats.incorrectAnswers;
  const correctAnswersPercentage =
    totalAnswers > 0 ? (stats.correctAnswers / totalAnswers) * 100 : 0;

  return {
    username: stats.username,
    completionPercentages: stats.completionPercentages,
    points: stats.points,
    correctAnswers: stats.correctAnswers,
    incorrectAnswers: stats.incorrectAnswers,
    totalCompletion: totalCompletion,
    totalPoints: totalPoints,
    correctAnswersPercentage: correctAnswersPercentage,
  };
}

module.exports = {
  initializeStats,
  deleteStats,
  getStats,
  updateStats,
};
