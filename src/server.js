const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const langchainRoutes = require('./routes/langchainRoutes');
const chatRoutes = require('./routes/chatRoutes');
const statsRoutes = require('./routes/statsRoutes');
const leaderboardsRoutes = require('./routes/leaderboardsRoutes');
const setupMiddleware = require('./config/middleware');
const cors = require('cors');
require('dotenv').config();

connectDB();

const app = express();

app.use(cors());


setupMiddleware(app);
app.use('/api', userRoutes);
app.use('/api/langchain', langchainRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', statsRoutes);
app.use('/api', leaderboardsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
