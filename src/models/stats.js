const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  completionPercentages: {
    type: [Number],
    validate: {
      validator: function (array) {
        return array.every((num) => num >= 0 && num <= 100);
      },
      message: "Completion percentages must be between 0 and 100",
    },
    required: true,
  },
  points: {
    type: [Number],
    validate: {
      validator: function (array) {
        return array.every((num) => num >= 0);
      },
      message: "Points must be non-negative",
    },
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0,
  },
  incorrectAnswers: {
    type: Number,
    required: true,
    min: 0,
  },
});

module.exports = mongoose.model("Stats", statsSchema);
