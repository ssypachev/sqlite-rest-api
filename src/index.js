const path = require('path');
//Позднее эта глобальная переменная поможет в работе. Она определяет корень
//проекта
global.baseDir = path.resolve(__dirname);

const express = require('express'),
	  app     = express(), //это экземпляр сервера
	  bodyParser = require('body-parser'),
	  router  = require(`${global.baseDir}/routes/index.js`),
	  logger  = require('bunyan'),
	{ Settings } = require(`${global.baseDir}/options/Settings.js`);

require('express-async-errors');

const log = new logger(Settings.logging.index);

app.use(bodyParser.json());

(async () => {
	await router(app);
	await app.listen(Settings.server.port).on('error', (err) => {
		log.error(err);
	});
	log.info(`Server listening to ${Settings.server.schema}://${Settings.server.host}:${Settings.server.port}`);
})();

