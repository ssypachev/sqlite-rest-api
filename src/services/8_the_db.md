8_the_db
Для того, чтобы начать работу с базой, поставим две библиотеки. Sequelize – ORM для работы с базой, и sqlite3 драйвер для базы.

`npm install --save sqlite3 sequelize`

ORM `sequelize` позволяет работать с базой как с набором объектов, избегая прямых sql запросов. Это позволяет делать переносимые программы, которые не зависят от выбора базы, прячут логику запросов и освобождают программиста от рутинных операций, позволяя ему сконцентрироваться на бизнес-логике приложения.

Минусом является потеря контроля над базой, невозможность использования специфических, удобных для работы методов РСУБД, значительное проседание производительности (либо, значительный рост потребляемой ОЗУ в случае кеширования и хранения объектов в памяти).

Sequelize, кроме того, предоставляет пул соединений, который значительно ускоряет работу с сервером СУБД.

Ещё одной особенностью ORM является возможность создавать базу с нуля. Сначала мы объявляем модели, а затем ЩКЬ по этим моделям создаёт структуру базы.
SQLite является встраиваемой БД, у неё нет сервера или клиентов.

### Создадим соединение с базой.

В соответствии с документацией, соединение будет осуществляться с помощью параметров dialect (диалект SQL) и storage (место размещения файла с БД). Поместим их в Settings

```js
db: {
	dialect: 'sqlite',
	storage: path.resolve(__dirname + '../../../db/currencies.sqlite')
}
```

Далее, создадим файл `SQLFactory.js`, который будет возвращать инстанс соединения.
Теперь самое главное создать модель нашей валюты. Она не будет отличаться от того, что у нас уже имеется, за исключением того, то все поля теперь будут в camelCase.

Поле isoCode станет первичным ключом, а поле name уникальным.

```js
const { Sequelize, DataTypes, Model } = require('sequelize'),
	    sequelize = require(`${global.baseDir}/models/SQLFactory`).getSequelize();

const CurrencyModel = sequelize.define('Currency', {
	
	isoCode: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true,
	},
	
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	
	symbol: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	
	subunit: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	
	isoNumeric: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	
	rate: {
		type: DataTypes.FLOAT,
		allowNull: false,
		defaultValue: 0.0
	}
	
}, {
	timestamps: false
});

module.exports.CurrencyModel = CurrencyModel;
```

Опция `timestamps: false` необходима для отключения автогенерируемых полей в таблице, которые нам сейчас не нужны.

Теперь мы можем ипользовать эту модель для работы с базой. Для начала будем создавать новую базу каждый раз, когда включаем сервер. Как и раньше, начнём заполнять её данными.

```js
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

`Sync.force` с опцией `true` говорит о том, что база и все таблицы будут пересоздаваться заново каждый раз при запуске сервера. Пока для нас это нормально.
Переделываем все методы сервиса, замещая обращение к объекту currencies на работу с базой

```
async list () {
	try {
		//Получить все строки таблицы
		const currencies = await CurrencyModel.findAll();
		return [null, currencies];
	} catch (err) {
		return [err, null];
	}
}
```

Таким образом, заменяем все методы, используя документацию.

```js
async get (code) {
	try {
		//Найти объект по первичному ключу
		const currency = await CurrencyModel.findByPk(code);
		return [null, currency];
	} catch (err) {
		return [err, null];
	}
}
	
async create (currency) {
	try {
		//Так как поля isoCode и name уникальны, то сначала проверяем на то, что они уже существуют
		const exc = await CurrencyModel.findOne({ 
			where: { 
				[Op.or]: [{ 
					isoCode: currency.isoCode 
				}, { 
					name: currency.name 
				}] 
			} 
		});
		if (exc) {
			return [409, null];
		}
		await CurrencyModel.create(currency);
		return [null, null];
	} catch (err) {
		return [err, null];
	}
}
	
async remove (code) {
	try {
		//Для удаления объекта, сначала достаём его из базы
		const exc = await CurrencyModel.findByPk(code);
		if (exc) {
			//После этого вызываем его метод удаления
			await exc.destroy();
			return [null, null];
		}
		return [404, null];
	} catch (err) {
		return [err, null];
	}
}
	
async update (code, { rate }) {
	try {
		//Для изменения объекта сначала ищем его по первичному ключу
		const exc = await CurrencyModel.findByPk(code);
		if (exc) {
			//Затем вносим изменения
			exc.rate = rate;
			//После чего сохраняем
			await exc.save();
			return [null, null];
		}
		return [404, null];
	} catch (err) {
		return [err, null];
	}
}
```

Не забываем, что поля `iso_code` и `iso_numeric` превратились в `isoCode` и `isoNumeric`, вносим соответствующие изменения в routes и в тесты


