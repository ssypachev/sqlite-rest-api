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
		/**
		host: '127.0.0.1',
		port: '3306',
		user: 'sqlite_rest_api',
		password: 'KgMmaA7QgX1qHZig',
		dialect: 'mysql',
		database: 'sqlite_rest_api',
		dialectOptions: {
			decimalNumbers: true,
		},
		timezone: '+05:00',
		charset: 'utf8mb4',
		pool: {
			min: 5,
			max: 15,
			idle: 30000
		}
		*/
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