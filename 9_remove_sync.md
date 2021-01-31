9 Удаление синхронизации

Удалим синхронизацию, которая удаляет и пересоздаёт базу каждый раз. Для этого отдельный скрипт, который будет создавать базу и заполнять её.
Перенесём создание и синхронизацию в файл `./src/create.db.js`

```js
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
```

Так как переменная `global.baseDir` используется в других модулях, то необходимо её явно объявить.

Добавим этот скрипт в package.json

`"dbinit": "node ./src/create.db.js"`

И, конечно, удалим теперь ненужный код из `CurrencyService`.
Теперь можно создавать базу по модели вызовом

`npm run dbinit`
