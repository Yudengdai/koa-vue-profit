'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
     id: {
     	allowNull: false,
     	autoIncrement: true,
     	primaryKey: true,
     	type: Sequelize.INTEGER
     },
     username: {
     	type: Sequelize.STRING(255),
     	allowNull: false,
     },
     email: {
     	type: Sequelize.STRING(255),
     	allowNull: false,
     },
	 ip: {
	 	type: DataTypes.STRING(255),
	 },
	 address: {
	 	type: DataTypes.STRING(255),
	 },
     password: {
     	type: Sequelize.STRING(255),
     	allowNull: false,
     },
     avatar: {
     	type: Sequelize.STRING(255),
     },
     identity: {
     	type: Sequelize.STRING(255),
     	allowNull: true,
     },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};