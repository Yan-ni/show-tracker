const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const controllers = require('../controllers');

const router = express.Router();

router.post('/', verifyToken, controllers.show.create);
router.put('/:id', verifyToken, controllers.show.update);
// router.delete('/:id', verifyToken, controllers.show.delete);

module.exports = router;
