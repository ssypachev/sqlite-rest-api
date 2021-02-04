const { Settings }  = require(`${global.baseDir}/options/Settings.js`),
	  { Sequelize } = require('sequelize');

const dbSettings = Settings.getDBSettings();

const sequelize = new Sequelize({
	...dbSettings
})
/**
let sequelize = new Sequelize(Settings.db.database, Settings.db.user, Settings.db.password, {
	...Settings.db
});
*/

module.exports.getSequelize = () => {
	return sequelize;
}