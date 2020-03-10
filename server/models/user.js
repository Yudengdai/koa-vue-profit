'use strict';
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		username: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		ip: {
			type: DataTypes.STRING(255),
		},
		address: {
			type: DataTypes.STRING(255),
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		avatar: {
			type: DataTypes.STRING(255),
		},
		identity: { 
			type: DataTypes.STRING(255),
			allowNull: true,
		},
	}, {});
	User.associate = function(models) {
		// associations can be defined here
	};
	return User;
};
