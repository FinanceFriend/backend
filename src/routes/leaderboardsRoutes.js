const express = require('express');
const router = express.Router();
const leaderboardsController = require('../controllers/leaderboardsController');

router.get('/leaderboard/general', leaderboardsController.getGeneralLeaderboard);
router.get('/leaderboard/general/:username', leaderboardsController.getGeneralLeaderboardByUser);
router.get('/leaderboard/country/:country', leaderboardsController.getCountryLeaderboard);
router.get('/leaderboard/country/:country/:username', leaderboardsController.getCountryLeaderboardByUser);
router.get('/leaderboard/age/:age', leaderboardsController.getAgeLeaderboard);
router.get('/leaderboard/age/:age/:username', leaderboardsController.getAgeLeaderboardByUser);

module.exports = router;