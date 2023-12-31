const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  countryOfOrigin: {
    type: String,
    required: true
  },
  preferredLanguage: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);