require("mongoose");
const path = require("path");
const { readFileSync } = require("fs");
const Stats = require("../models/stats");

const initialProgress = new Array(5).fill({
  blockId: 0,
  minilessonId: 0,
});

const initializeStats = async (username) => {
  try {
    const newStats = new Stats({
      username,
      completionPercentages: new Array(5).fill(0),
      points: new Array(5).fill(0),
      correctAnswers: 0,
      incorrectAnswers: 0,
      progress: initialProgress,
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

    const updateDataProgress = updateData.progress;
    const userOldStats = await Stats.findOne({ username });

    if (updateDataProgress != null) {
      let progress = userOldStats.progress;
      if (progress.length == 0) progress = initialProgress;
      progress[updateDataProgress.locationId] = {
        blockId: updateDataProgress.blockId,
        minilessonId: updateDataProgress.minilessonId,
      };
      updateData.progress = progress;
      updateData.completionPercentages = userOldStats.completionPercentages;
      updateData.completionPercentages[updateDataProgress.locationId] =
        updateCompletionPercentage(updateDataProgress);
    }

    if (updateData.correctAnswers) {
      updateData.correctAnswers += userOldStats.correctAnswers;
    }

    if (updateData.incorrectAnswers) {
      updateData.incorrectAnswers += userOldStats.incorrectAnswers;
    }

    if (updateData.locationId >= 0 && updateData.newPoints > 0) {
      updateData.points = userOldStats.points;
      updateData.points[updateData.locationId] += updateData.newPoints;
    }

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
    progress: stats.progress,
  };
}

function updateCompletionPercentage(updateDataProgress) {
  const dataPath = path.join(
    __dirname,
    "..",
    "langchain",
    "docs",
    "locations.json"
  );

  const data = readFileSync(dataPath);
  const jsonObject = JSON.parse(data);

  const locationName = jsonObject.find(
    (obj) => obj.id === updateDataProgress.locationId
  ).name;

  const locationDataPath = path.join(
    __dirname,
    "..",
    "langchain",
    "docs",
    locationName + ".json"
  );

  const locationData = readFileSync(locationDataPath);
  const locationJsonObject = JSON.parse(locationData);

  return calculateProgress(
    locationJsonObject,
    updateDataProgress.blockId,
    updateDataProgress.minilessonId
  );
}

function calculateProgress(blocks, lastBlockId, lastMinilessonId) {
  let totalMinilessons = 0;
  let completedMinilessons = 0;

  blocks.forEach((block, index) => {
    totalMinilessons += block.mini_lessons.length;

    if (index < lastBlockId) {
      completedMinilessons += block.mini_lessons.length;
    } else if (index === lastBlockId) {
      completedMinilessons += lastMinilessonId + 1;
    }
  });

  if (completedMinilessons === 1) completedMinilessons = 0;

  if (completedMinilessons > totalMinilessons)
    completedMinilessons = totalMinilessons;

  return (completedMinilessons / totalMinilessons) * 100;
}

module.exports = {
  initializeStats,
  deleteStats,
  getStats,
  updateStats,
};
