13_multienvironment

Удобно для работы использовать несколько «сред», окружений, настроек системы, которые изменяют поведение программы.

Например, когда мы разрабатываем сервер, нам необходима тестовая база, для тестирования мы можем пересобирать базу каждый раз при запуске, а для работы в «проде», на production сервере нужны третьи настройки.

Воспользуемся установленным ранее пакетом cross-env, который позволяет задавать значения кроссплатформенно.

Сделаем небольшой пример, который покажет, как работать с несколькими окружениями.
Перепишем скрипт старта системы

```json
"start":       "cross-env NODE_ENV=production node ./src/index.js",
"dev":         "cross-env NODE_ENV=development node ./src/index.js",
```

Вызов `cross-env NODE_ENV=production` создаёт переменную `NODE_ENV`, которая имеет значение production. В коде сервера обратиться к ней можно через объект process

`console.log(process.env.NODE_ENV)`

выведет значение этой переменной

Теперь мы можем задать две настройки для нашей базы

```js
db: {
		production: {
			dialect: 'sqlite',
			storage: path.resolve(__dirname + '../../../db/currencies-prod.sqlite')
		},
		development: {
			dialect: 'sqlite',
			storage: path.resolve(__dirname + '../../../db/currencies-dev.sqlite')
		}
}
```

А чтобы удобнее было получать эти настройки, создадим функцию, которая будет возвращать конкретные настройки в зависимости от состояния `NODE_ENV`

```js
getDBSettings () {
	return Settings.db[process.env.NODE_ENV];
}
```

Это приведёт к изменению `SQLFactory.js`

```js
const dbSettings = Settings.getDBSettings();

const sequelize = new Sequelize({
	...dbSettings
})
```

Добавим ещё два скрипта, один будет создавать рабочую базу, а другой тестовую

```json
"dbinit":      "cross-env NODE_ENV=production node ./src/create.db.js",
"dbinit:dev":  "cross-env NODE_ENV=development node ./src/create.db.js"
```

Теперь для инициализации тестовой базы вызовем

`npm run dbinit:dev`

для старта тестового сервера

`npm run dev`

Рабочая версия вызывается как раньше
