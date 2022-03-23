const { Sequelize } =  require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Collection = sequelize.define('Collection', {
    collection_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    collection_name: {
      type: DataTypes.STRING(15),
      allowNull: false
    }
  });

  Collection.associate = (models) => {
    models.Collection.hasMany(models.Show, { foreignKey: 'collection_id' });
  }

  return Collection;
}
