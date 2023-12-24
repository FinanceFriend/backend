const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const setupMiddleware = require('./config/middleware');
require('dotenv').config();

connectDB();

const app = express();
setupMiddleware(app);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
