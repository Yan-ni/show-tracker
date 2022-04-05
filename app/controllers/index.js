const fs = require('fs');

const path = require('path');

const controllers = {};

fs
  .readdirSync(__dirname)
  .filter((fileName) => fileName !== 'index.js')
  .forEach((fileName) => {
    controllers[fileName.slice(0, -3)] = require(path.join(__dirname, fileName));
  });

module.exports = controllers;
