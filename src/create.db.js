const path = require('path');
global.baseDir = path.resolve(__dirname);

const { CurrencyModel } = require(`${global.baseDir}/models/CurrencyModel.js`),
	  { Op } = require('sequelize');
	  
CurrencyModel.sync({
	force: true
}).then(() => {
	return CurrencyModel.bulkCreate([{
		"isoCode":  "inr",
		"name": 	"Indian Rupee",
		"symbol":	"₹",
		"subunit": 	"Paisa",
		"isoNumeric": "356",
		"rate": 	72.91
	}, {
		"isoCode":  "rub",
		"name": 	"Russian Ruble",
		"symbol": 	"₽",
		"subunit": 	"Kopeck",
		"isoNumeric": "643",
		"rate":		75.96
	}, {
		"isoCode":  "usd",
		"name": 	"United States Dollar",
		"symbol": 	"$",
		"subunit": 	"Cent",
		"isoNumeric": "840",
		"rate":		1.00
	}]);
});