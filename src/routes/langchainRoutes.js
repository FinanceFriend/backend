const express = require('express');
const router = express.Router();
const langchainController = require('../controllers/langchainController');

router.get('/lessonsLoremIpsum', langchainController.getLessonMessageLoremIpsum);
router.post('/userMessage', langchainController.getAnswerToUserMessage);
router.post('/welcome', langchainController.getWelcomeMessage);
router.post('/lessonMessage', langchainController.getLessonMessageAlt);
router.get('/lessonNames', langchainController.getLessonsndMiniLessonsName);

module.exports = router;