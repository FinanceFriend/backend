const express = require('express');
const router = express.Router();
const chatControlller = require('../controllers/chatController');

router.get('/', chatControlller.getChatForUserAndLocation);
router.post('/', chatControlller.saveMessage);


module.exports = router;