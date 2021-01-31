7_error_frame

Прежде чем двигаться дальше проведём быстрый профайлинг. Сделаем так, чтобы все методы сервиса возвращали всегда единообразное значение. Если все методы всегда возвращают одно и то же, тогда заметно упрощается разработка, api становится единообразным.

Способов сделать так предостаточно. Выберем самый простой: сервис всегда возвращает массив, первый элемент которого это ошибка, а второй – это результат работы.
Например, для нашего метода list

```js
async list () {
	try {
		const currency = Object
		.values(currencies)
		.sort((a, b) => a.iso_code.localeCompare(b.iso_code));
		return [null, currency];
	} catch (err) {
		return [err, null];
	}
}
```

Тогда наш контроллер будет выглядеть так

```js
async list (req, res) {
	const [err, list] = await new CurrencyService().list();
	if (err) {
		return res.status(500).send(err);
	}
	return res.json(list);
}
```

Получение одной валюты

```js
async get (code) {
	try {
		if (currencies.hasOwnProperty(code)) {
			return [null, currencies[code]];
		}
		return [null, null];
	} catch (err) {
		return [err, null];
	}
}
```

И контроллер

```js
async get (req, res, { code }) {
	const [err, currency] = await new CurrencyService().get(code);
	if (err) {
		return res.status(500).send(err);
	}
	if (currency === null) {
		return res.status(404).send(`Currency specified by code ${code} not found`);
	}
	return res.json(currency);
}
```

То же самое делаем и со всеми другими методами (см репозиторий).

Самое важное – все изменения, произошедшие на сервере могут теперь быть протестированы с помощью написанных ранее тестов.
