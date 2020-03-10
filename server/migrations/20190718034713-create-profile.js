'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Profiles', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			type: {
				type: Sequelize.STRING(255),
			},
			describe: {
				type: Sequelize.STRING(255),
			},
			income: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			expend: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			cash: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			remark: {
				type: Sequelize.STRING(255),
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
		return queryInterface.dropTable('Profiles');
	}
};
