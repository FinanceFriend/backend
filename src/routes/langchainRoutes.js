const express = require('express');
const router = express.Router();
const langchainController = require('../controllers/langchainController');

router.get('/lessons', langchainController.getLessonMessage);

module.exports = router;