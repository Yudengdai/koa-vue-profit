'use strict';
module.exports = (sequelize, DataTypes) => {
	const Profile = sequelize.define('Profile', {
		type: {
			type: DataTypes.STRING(255),
		},
		describe: {
			type: DataTypes.STRING(255),
		},
		income: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		expend: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		cash: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		remark: {
			type: DataTypes.STRING(255),
		},
	}, {});
	Profile.associate = function(models) {
		// associations can be defined here
	};
	return Profile;
};
