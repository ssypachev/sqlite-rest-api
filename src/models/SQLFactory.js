const { Settings }  = require(`${global.baseDir}/options/Settings.js`),
	  { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
	...Settings.db
})

module.exports.getSequelize = () => {
	return sequelize;
}