const mongoose = require('mongoose');

const HelloSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Hello', HelloSchema);
