const express = require('express');

const router = express.Router();

const controllers = require('../controllers');

const veriftToken = require('../middlewares/verifyToken');

router.post('/', veriftToken, controllers.collection.create);
router.put('/:id', veriftToken, controllers.collection.update);
router.delete('/:id', veriftToken, controllers.collection.delete);


module.exports = router;