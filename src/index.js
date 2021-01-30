const path = require('path');
//Позднее эта глобальная переменная поможет в работе. Она определяет корень
//проекта
global.baseDir = path.resolve(__dirname);

const express = require('express'),
	  app     = express(); //это экземпляр сервера

require('express-async-errors');

(async () => {
	const PORT = 3233;
	
	await app.listen(PORT);
	console.log(`Server listening to ${PORT}`);
})();

