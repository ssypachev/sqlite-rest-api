const { Settings }  = require(`${global.baseDir}/options/Settings.js`),
	  { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
	...Settings.db
})
/**
let sequelize = new Sequelize(Settings.db.database, Settings.db.user, Settings.db.password, {
	...Settings.db
});
*/

module.exports.getSequelize = () => {
	return sequelize;
}