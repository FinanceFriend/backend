const express = require('express');
const router = express.Router();
const leaderboardsController = require('../controllers/leaderboardsController');

router.get('/leaderboard', leaderboardsController.getLeaderboard);
router.get('/leaderboard/general/:username', leaderboardsController.getGeneralLeaderboardByUser);
router.get('/leaderboard/country/:country/:username', leaderboardsController.getCountryLeaderboardByUser);
router.get('/leaderboard/age/:age/:username', leaderboardsController.getAgeLeaderboardByUser);

module.exports = router;