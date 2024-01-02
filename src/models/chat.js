const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    enum: ['User', 'AI']
  },
  compressedContent: {
    type: String,
    required: true
  }
});

const chatSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  location_id: {
    type: Number,
    required: true
  },
  messagesList: [[messageSchema]] 
});

module.exports = mongoose.model('Chat', chatSchema);