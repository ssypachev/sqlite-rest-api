const { Settings }  = require(`${global.baseDir}/options/Settings.js`),
	  { Sequelize } = require('sequelize');

/** sqlite3
const sequelize = new Sequelize({
	...Settings.db
})
*/
let sequelize = new Sequelize(Settings.db.database, Settings.db.user, Settings.db.password, {
	...Settings.db
});

module.exports.getSequelize = () => {
	return sequelize;
}