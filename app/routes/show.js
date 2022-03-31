const express = require('express');

const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');

const controllers = require('../controllers');

router.post('/', verifyToken, controllers.show.create);
router.put('/:id', verifyToken, controllers.show.update);
// router.delete('/:id', verifyToken, controllers.show.delete);

module.exports = router;