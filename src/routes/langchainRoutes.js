const express = require('express');
const router = express.Router();
const langchainController = require('../controllers/langchainController');

router.get('/lessonsLoremIpsum', langchainController.getLessonMessageLoremIpsum);
router.post('/userMessage', langchainController.getAnswerToUserMessage);
router.post('/welcome', langchainController.getWelcomeMessage);
router.post('/lessonMessage', langchainController.getLessonMessageAlt);
router.post('/freeformUserMessage', langchainController.getFreeformMessage);
router.get('/lessonNames', langchainController.getLessonsndMiniLessonsName);
router.get('/generateImage', langchainController.getGeneratedImage);

module.exports = router;