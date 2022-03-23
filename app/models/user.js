const { Sequelize } =  require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(72),
      allowNull: false
    }
  });

  User.associate = (models) => {
    models.User.hasMany(models.Collection, { foreignKey: 'user_id' });
  }

  return User;
}