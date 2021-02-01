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
	},
	
	logging: {
		'index': { 
			name: 'index',
			streams: [{
				path: path.resolve(__dirname + '../../../log/info.log'),
				level: 'info'
			}, {
				path: path.resolve(__dirname + '../../../log/error.log'),
				level: 'error'
			}]
		}
	}
	
}

module.exports.Settings = Settings;