const path = require('path');

const Settings = {
	
	server: {
		schema: "http",
		host: "localhost",
		port: 3233
	},
	
	api: {
		base: '/api/v1'
	},
	
	db: {
		dialect: 'sqlite',
		storage: path.resolve(__dirname + '../../../db/currencies.sqlite')
	}
	
}

module.exports.Settings = Settings;