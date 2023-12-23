const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

connectDB();

const app = express();
const routeExample = require('./routes/routeExample');

app.use('/api', routeExample);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
