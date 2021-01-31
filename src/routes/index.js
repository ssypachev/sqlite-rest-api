const { Settings } = require(`${global.baseDir}/options/Settings.js`); 
const routes = ['CurrencyRoutes.js'];

module.exports = async (app) => {
	
	const BASE = Settings.api.base;
	
	for (const path of routes) {
		const route = require(`${global.baseDir}/routes/${path}`);
		await route({ app, BASE });
	}
}