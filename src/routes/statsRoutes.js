const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/stats/:username', statsController.getStats);
router.put('/stats/:username', statsController.updateStats);

module.exports = router;