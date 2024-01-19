const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const langchainRoutes = require('./routes/langchainRoutes');
const chatRoutes = require('./routes/chatRoutes');
const statsRoutes = require('./routes/statsRoutes');
const leaderboardsRoutes = require('./routes/leaderboardsRoutes');
const setupMiddleware = require('./config/middleware');
const cors = require('cors');
const fs = require('fs')
const path = require('path');
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

const filePath = path.join(__dirname, '..', 'api-docs.md');
app.get('/', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading the Markdown file.');
            return;
        }
        const htmlContent = marked(data);
        res.send(htmlContent);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
