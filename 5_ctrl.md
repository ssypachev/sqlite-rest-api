5_ctrl

Перераспределим обязанности наших компонентов. Мы хотим, чтобы рут занимался маппингом (отображением) адресов и связывал их с функциями-обработчиками, которые уже выполняют какую-то работу.

Рут должен получать параметры, чистить их, валидировать, а затем передавать дальше, так чтобы компоненты системы уже не занимались проверкой, «хорошие» они или «плохие».
Гибкость js, с одной стороны, позволяет писать более гибкий код за меньшее время, с другой стороны, это оборачивается ошибками, связанными с неправильным типом данных.
Выделим работу с нашими сервисами в отдельный слой – контроллеры, который уже и будут обращаться к необходимым сервисам.

Создадим папку `controllers` и наш контроллер валют `CurrencyController.js`
Перенесём в него работу с сервисом, и оставим в рутах валидацию переменных.
Например, наш рут на получение списка станет таким

```js
app.get(`${BASE}`, async (req, res) => {
	return new CurrencyController().list(req, res);
});
```

А метод контроллера

```js
async list (req, res) {
	const list = await new CurrencyService().list();
	return res.json(list);
}
```

Рут создания валюты

```js
app.post(`${BASE}`, async (req, res) => {
	const iso_code = req.body.iso_code,
		  name     = req.body.name,
		  symbol   = req.body.symbol,
		  subunit  = req.body.subunit,
		  iso_numeric = req.body.iso_numeric,
		  rate     = req.body.rate;
	return new CurrencyController().create(req, res, {
		iso_code, name, symbol, subunit, iso_numeric, rate
	});
});
```

А метод контроллера

```js
async create (req, res, currency) {
	const err = await new CurrencyService().create(currency);
	if (err === 409) {
		return res.status(409).send(`Duplicate entry. Currency ${req.body.iso_code} exists`);
	}
	return res.json(true);
}
```

И т.д.

Теперь, воспользуемся какой-нибудь библиотекой для валидации входных параметров, чтобы обезопасить наш сервер

`npm install –save secval`

Можете использовать любую другую библиотеку для работы
