const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

fs
  .readdirSync(__dirname)
  .filter((fileName) => fileName !== 'index.js')
  .forEach((fileName) => {
    router.use(`/${fileName.slice(0, -3)}`, require(path.join(__dirname, fileName)));
  });

module.exports = router;
