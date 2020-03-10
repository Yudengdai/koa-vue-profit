'use strict';
module.exports = (sequelize, DataTypes) => {
  const news = sequelize.define('News', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    img: DataTypes.STRING,
    content: DataTypes.STRING,
	views:DataTypes.INTEGER,
	likes:DataTypes.INTEGER,
  }, {});
  news.associate = function(models) {
    // associations can be defined here
  };
  return news;
};