const path = require('path');
//Позднее эта глобальная переменная поможет в работе. Она определяет корень
//проекта
global.baseDir = path.resolve(__dirname);

const express = require('express'),
	  app     = express(), //это экземпляр сервера
	  router  = require(`${global.baseDir}/routes/index.js`),
	{ Settings } = require(`${global.baseDir}/options/Settings.js`);

require('express-async-errors');

router(app);

(async () => {
	await app.listen(Settings.server.port);
	console.log(`Server listening to ${Settings.server.schema}://${Settings.server.host}:${Settings.server.port}`);
})();

