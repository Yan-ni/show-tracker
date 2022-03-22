const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

fs
  .readdirSync(__dirname)
  .filter(fileName => fileName !== 'index.js')
  .forEach(fileName => {
    router.use(`/${fileName.slice(0, -3)}`, require(path.join(__dirname, fileName)));
  })

module.exports = router;