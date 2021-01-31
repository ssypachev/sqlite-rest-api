const { Sequelize, DataTypes, Model } = require('sequelize'),
	    sequelize = require(`${global.baseDir}/models/SQLFactory`).getSequelize();

const CurrencyModel = sequelize.define('Currency', {
	
	isoCode: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true,
	},
	
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	
	symbol: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	
	subunit: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	
	isoNumeric: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	
	rate: {
		type: DataTypes.FLOAT,
		allowNull: false,
		defaultValue: 0.0
	}
	
}, {
	timestamps: false
});

module.exports.CurrencyModel = CurrencyModel;