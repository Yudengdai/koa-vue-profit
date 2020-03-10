'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('news', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
	  author: {
	    type: Sequelize.STRING
	  },
	  img: {
	    type: Sequelize.STRING
	  },
	  content: {
	    type: Sequelize.STRING
	  },
	  views: {
	    type: Sequelize.INTEGER
	  },
	  likes: {
	    type: Sequelize.INTEGER
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
    return queryInterface.dropTable('news');
  }
};