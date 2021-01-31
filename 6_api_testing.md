6_api_testing

Теперь необходимо провести тестирование нашего сервера. Так как сервис ещё не готов, интеграционного тестирования у нас нет. Будем проводить тестирование полученного api.

От DDD в силу того, что мы обучаемся, мы отказались, поэтому начнёт строить тесты после написания сервера.

Для начала создадим папку `/tests/api`

И в неё файл `CurrencyRoutesTest.js`

Мы будем использовать установленную ранее библиотеку mocha, вспомогательную библиотеку `chai` и надстройку `chai-http` для работы с http api.

На пустой файл для теста выглядит так

```js
const chai      = require('chai'),
      chaiHttp  = require('chai-http');
	  
chai.use(chaiHttp);

describe('Should test currency routes', async () => {
	
	it ('Should test 1+2', async () => {
		const a = 1;
		const b = 2;
		chai.expect(a + b).to.equal(3);
	});
	
});
```

Мы написали элементарный тест 1+2 === 3.

Теперь самое важное его запустить.

Запуск можно произвести из командной строки, обратившись к фреймворку тестирования mocha

`node_modules\.bin\mocha tests\api\CurrencyRoutesTest.js`

или же

`node_modules\.bin\mocha tests\api`

и тогда mocha произведёт тестирование всех файлов, находящихся в папке

Либо написать скрипт в `package.json`, который сделает то же самое. Но, в контексте package ему нет нужды указывать полный путь к библиотеке. Добавим скрипт

`"test:api": "mocha tests/api"`

Теперь его можно запустить через npm

`npm run test:api`

Замечу, что здесь знак «:» является просто частью имени скрипта.

Начнём теперь заполнять тест чем-нибудь полезным. Для начала протестируем метод list

```js
    const HOST = "http://localhost:3233";
	
	it ('Should test list', async () => {
		const res = await chai.request(HOST)
		.get('/api/v1/currencies');
		
		console.log(res.body);
	});
```

Видно, что `res.body` содержит необходимые нам данные. Проведём теперь их валидацию.

```js
chai.expect(res).to.have.status(200);
chai.expect(res.body).to.be.an('array');
```

Методы библиотеки chai говорят сами за себя.

Протестируем теперь метод получения одной валюты

```js
it ('Should get one currency by code', async () => {
	const res = await chai.request(HOST)
	.get('/api/v1/currencies/rub');
	
	chai.expect(res).to.have.status(200);
	chai.expect(res.body).to.be.an('object');
	chai.expect(res.body).to.deep.equal({
		"iso_code": "RUB",
		"name": 	"Russian Ruble",
		"symbol": 	"₽",
		"subunit": 	"Kopeck",
		"iso_numeric": "643",
		"rate":		75.96
	});
});
```

Здесь мы протестировали, что метод действительно возвращает нам объект и что этот объект равен (глубоко, по всем вложенным полям) тому, что мы и ожидаем получить.
Кроме этого, нам необходимо протестировать случай, когда мы пытаемся получить валюту, которой не существует

```js
it ('Should fail to get qqq currency', async () => {
	const res = await chai.request(HOST)
	.get('/api/v1/currencies/qqq');
	
	chai.expect(res).to.have.status(404);
});
```

И так далее, для всех методов.

Может возникнуть вопрос – а сколько же нужно методов для тестирования, для тестирования всех методов? В общем случае, ответить довольно сложно, так как необходимо покрыть все возможные случаи и все комбинации всех ветвлений.
Кроме того, сами методы тестирования должны быть однозначными и максимально простыми и не содержать минимум логики, иначе тогда и сами методы тестирования необходимо будет покрывать тестами.

Существую инструменты для покрытия кода тестами, например, Istanbul, или различные плагины к swagger.

Полное тестирование api, кроме того, подразумевает конечное тестирование, e2e, с выполнением сценариев использования api. Например, протестируем создание новой валюты, проверим, что её нельзя повторно создать, удалим и проверим, что она больше не появляется.

```js
it ('Should test usecase: create, find, delete, find', async () => {
	let res = await chai.request(HOST)
	.post('/api/v1/currencies')
	.send({
		"iso_code": "SAR",
		"name": "Saudi Riyal",
		"symbol": "ر.س",
		"subunit": "Hallallah",
		"iso_numeric": "682",
		"rate": 0.27
	});
	
	chai.expect(res).to.have.status(200);
		
	res = await chai.request(HOST)
	.get('/api/v1/currencies');
	
	chai.expect(res).to.have.status(200);
	
	let sar = res.body.find(x => x.iso_code === 'SAR');
	chai.expect(sar).not.to.be.null;
	
	res = await chai.request(HOST)
	.delete('/api/v1/currencies/sar');
	
	chai.expect(res).to.have.status(200);
	
	res = await chai.request(HOST)
	.get('/api/v1/currencies');
	
	chai.expect(res).to.have.status(200);
	
	sar = res.body.find(x => x.iso_code === 'SAR');
	chai.expect(sar).to.be.undefined;
});
```

