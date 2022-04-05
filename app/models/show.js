const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Show = sequelize.define('Show', {
    show_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    show_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    show_description: {
      type: DataTypes.STRING,
    },
    seasons_watched: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    episodes_watched: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // favorite: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false
    // },
    // completed: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false
    // },
    image_url: {
      type: DataTypes.STRING,
    },
  });

  return Show;
};
