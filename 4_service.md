4_service

Теперь мы хотим добавить какой-то полезной логики в наш сервис по работе с валютами.
Логику работы поместим в отдельный компонент. Для начала, не будем использовать базу и разместим все нужные нам данные в переменной.

Создадим файл `CurrencyService.js` в папке `services`.

Добавим сначала нашу переменную currencies и заполним её парой-тройкой значений

```js
const currencies = {
	"inr": {
		"iso_code": "INR",
		"name": 	"Indian Rupee",
		"symbol":	"₹",
		"subunit": 	"Paisa",
		"iso_numeric": "356",
		"rate": 	72.91
	},
	"rub": {
		"iso_code": "RUB",
		"name": 	"Russian Ruble",
		"symbol": 	"₽",
		"subunit": 	"Kopeck",
		"iso_numeric": "643",
		"rate":		75.96
	},
	"usd": {
		"iso_code": "USD",
		"name": 	"United States Dollar",
		"symbol": 	"$",
		"subunit": 	"Cent",
		"iso_numeric": "840",
		"rate":		1.00
	}
};
```

После чего создадим класс, который будет обслуживать работу с этой переменной. Сделаем все методы асинхронными, будем возвращать промис, чтобы после того, как мы перейдём к базе, пользователи нашего сервиса не меняли код.

Первый метод `list`. Он просто возвращает массив наших валют, отсортированный по ключу.

```js
async list () {
	return Object
		.values(currencies)
		.sort((a, b) => a.iso_code.localeCompare(b.iso_code));
}
```

Теперь необходимо связать сервис с рутом, который должен возвращать наше значение. Так как никаких параметров передаваться не будет, то код будет максимально простым. Создадим переменную, которая будет хранить список, вернём json.

```js
app.get(`${BASE}`, async (req, res) => {
	const list = await new CurrencyService().list();
	return res.json(list);
});
```

С методом получения определённой валюты по `id` (в нашем случае ключом является уникальный трёхбуквенный код) нам необходимо передавать параметр. Будем передавать его в url, так как (по соглашению REST) этот `id` определяет сущность в нашем множестве всех `currencies`.

Объявить параметр в руте можно с помощью символа `:`

`` `${BASE}/:code` ``

Объект `req` содержит  поле `params`, которое включает все параметры строки url. В данном случае, оно будет содержать параметр code. Так что получить его можно будет

`const code = req.params.code`

Но, нам заранее известно, что код – это три буквы, в нижнем регистре. Так что, мы можем ограничить все возможные руты с помощью регулярного выражения.

`` `${BASE}/:code([a-z]{3})`` `

```js
app.get(`${BASE}/:code([a-z]{3})`, async (req, res) => {
	const code = req.params.code;
	const currency = await new CurrencyService().get(code);
	if (currency === null) {
		return res.status(404).send(`Currency specified by code ${code} not found`);
	}
	return res.json(currency);
});
```

Здесь встречается новая конструкция – `status`. По стандарту, в случае, если объект не найден, необходимо передать код ошибки 404, что мы и делаем.

Код сервиса очень простой – получаем валюту по её iso

```js
async get (code) {
	if (currencies.hasOwnProperty(code)) {
		return currencies[code];
	}
	return null;
}
```

Создание объекта становится сложнее. Во-первых, необходимо передавать json объект, а для этого надо подключить библиотеку, которая упростит парсинг параметров, передаваемых в теле запроса.

`npm install –save body-parser`

Затем нужно указать приложению, чтобы оно воспользовалось этой библиотекой (в файле index.js, нашем основной файле)

```js
bodyParser = require('body-parser'),
…
app.use(bodyParser.json());
```

Теперь приложение будет автоматически парсить json, передаваемый в теле запроса и превращать его в объект. Доступ к телу также происходит через поле запроса req

```js
app.post(`${BASE}`, async (req, res) => {
	const currency = req.body;
	const err = await new CurrencyService().create(currency);
	if (err === 409) {
		return res.status(409).send(`Duplicate entry. Currency ${req.body.iso_code} exists`);
	}
	return res.json(true);
});
```

В этом случае создание объекта осуществляется с помощью POST запроса, поэтому вызывается функция post.

И код сервиса

```js
async create (currency) {
	if (currencies.hasOwnProperty(currency.iso_code.toLowerCase())) {
		return 409;
	}
	currencies[currency.iso_code.toLowerCase()] = currency;
	return null;
}
```

Здесь вы сразу же видим огромную проблему – наш объект никак не валидируется, и в нашу импровизированную «базу» может попасть что угодно. В следующей ветке будем исправлять эту проблему.

Следующий рут, который необходим для работы с валютами – это удаление. В данном случае он достаточно прост:

```js
app.delete(`${BASE}/:code([a-z]{3})`, async (req, res) => {
	const code = req.params.code;
	const err = await new CurrencyService().remove(code);
	if (err === 404) {
		return res.status(404).send(`Currency specified by code ${code} not found`);
	}
	return res.json(true);
});
```

Сервис также просто удаляет вхождение объекта

```js
async remove (code) {
	if (currencies.hasOwnProperty(code)) {
		delete currencies[code];
		return null;
	}
	return 404;
}
```

Последний рут – для обновления объекта. Упростим задачу и изменять будем только rate – курс валюты по отношению к доллару.

Для реализации нам нужно передавать код валюты и параметр rate. Так как код валюты однозначно определяет сущность в нашей базе, то будем обращаться к этой сущности через url

`` `PUT /api/v1/currencies/:code` ``

```js
app.put(`${BASE}/:code([a-z]{3})`, async (req, res) => {
	const code = req.params.code;
	const rate = req.body.rate;
	const err = await new CurrencyService().update(code, { rate });
	if (err === 404) {
		return res.status(404).send(`Currency specified by code ${code} not found`);
	}
	return res.json(true);
});
```

И код сервиса

```js
async update (code, { rate }) {
	if (currencies.hasOwnProperty(code)) {
		currencies[code].rate = rate;
		return null;
	}
	return 404;
}
```

После того, как мы всё это сделали, возникли новые проблемы, без решения которых невозможно дальше развивать проект.

1.  Рут стал очень толстым и содержит много лишнего кода
2.  Нет никакой верификации входящих параметров
