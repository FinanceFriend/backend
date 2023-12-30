const express = require('express');
const router = express.Router();
const leaderboardsController = require('../controllers/leaderboardsController');

router.get('/leaderboard/general', leaderboardsController.getGeneralLeaderboard);
router.get('/leaderboard/general/:username', leaderboardsController.getGeneralLeaderboardByUser);
router.get('/leaderboard/:country', leaderboardsController.getCountryLeaderboard);
router.get('/leaderboard/:country/:username', leaderboardsController.getCountryLeaderboardByUser);

module.exports = router;