const express = require('express');
const router = express.Router();
const langchainController = require('../controllers/langchainController');

router.post('/lessons', langchainController.getLessonMessage);
router.get('/lessonsLoremIpsum', langchainController.getLessonMessageLoremIpsum);

router.post('/welcome', langchainController.getWelcomeMessage);
router.post('/lessonMessage', langchainController.getLessonMessageAlt);

module.exports = router;