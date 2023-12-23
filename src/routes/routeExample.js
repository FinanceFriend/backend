const express = require('express');
const router = express.Router();
const controllerExample = require('../controllers/controllerExample');

router.get('/hello', controllerExample.sayHello);

module.exports = router;
