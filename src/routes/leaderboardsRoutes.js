const express = require('express');
const router = express.Router();
const leaderboardsController = require('../controllers/leaderboardsController');

router.get('/leaderboard', leaderboardsController.getLeaderboard);
router.get('/leaderboard/:username', leaderboardsController.getLeaderboardByUser);

module.exports = router;