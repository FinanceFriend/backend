const mongoose = require('mongoose');

const connectDB = async () => {
    try {
      console.log('Connecting to:', process.env.MONGODB_URI);
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected...');
    } catch (err) {
      console.error('Connection error:', err.message);
    }
  };
  
module.exports = connectDB;
