const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './showTracker_database.sqlite'
});

const db = {};

fs
  .readdirSync(__dirname)
  .filter(fileName => fileName !== 'index.js')
  .forEach(fileName => {
    const model = require(path.join(__dirname, fileName))(sequelize, DataTypes);
    db[model.name] = model;
  });


Object
  .keys(db)
  .forEach((modelName) => db[modelName].associate && db[modelName].associate(db));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;