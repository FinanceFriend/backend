const express = require('express');
const router = express.Router();
const langchainController = require('../controllers/langchainController');

router.post('/lessons', langchainController.getLessonMessage);
router.get('/lessonsLoremIpsum', langchainController.getLessonMessageLoremIpsum);


module.exports = router;