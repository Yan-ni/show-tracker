const express = require('express');

const router = express.Router();

const controllers = require('../controllers');

const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, controllers.user.get);
// router.put('/', verifyToken, controllers.user.update);
// router.delete('/', verifyToken, controllers.user.update);

module.exports = router;
