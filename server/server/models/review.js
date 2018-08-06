'use strict';
export default (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    response: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  Review.associate = (models) => {
    Review.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Review.belongsTo(models.Business, {
      foreignKey: 'businessId',
      onDelete: 'CASCADE'
    });
  };
  return Review;
};
