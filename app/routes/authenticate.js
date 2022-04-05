const express = require('express');

const router = express.Router();

const controllers = require('../controllers');

router.post('/login', controllers.authenticate.login);
router.post('/signup', controllers.authenticate.signup);

module.exports = router;
