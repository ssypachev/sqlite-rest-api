11_migrate_to_mysql

Раз мы используем `sqlite`, покажем, сколько усилий необходимо приложить для того, чтобы перейти на другую РСУБД, например, на `MySQL`.

Создадим базу и пользователя в MySQL

```sql
create database sqlite_rest_api;
create user 'sqlite_rest_api'@'localhost' identified with mysql_native_password by 'KgMmaA7QgX1qHZig';
grant all privileges on sqlite_rest_api.* to 'sqlite_rest_api'@'localhost';
flush privileges;
```

После этого необходимо установить драйвер БД

`npm install mysql2 --save`

Далее, настройки MySQL сложнее, чем sqlite. MySQL это клиент-серверная БД, и её необходимо задать параметры для входа (логины, пароли и пр.).

Кроме того, каждое соединение с базой это дорогостоящая процедура, поэтому мы воспользуемся пулом соединений. Пул создаст несколько соединений на старте системы и будет раздавать их по мере необходимости.

Добавим такие настройки в `Settings`

```js
    /** Старые настройки базы для sqlite3
	dialect: 'sqlite',
	storage: path.resolve(__dirname + '../../../db/currencies.sqlite')
	*/
	host: '127.0.0.1',
	port: '3306',
	user: 'sqlite_rest_api',
	password: 'KgMmaA7QgX1qHZig',
	dialect: 'mysql',
	database: 'sqlite_rest_api',
	dialectOptions: {
		decimalNumbers: true,
	},
	timezone: '+05:00',
	charset: 'utf8mb4',
	pool: {
		min: 5,
		max: 15,
		idle: 30000
	}
```

Несколько изменится фабрика, создающая соединения

```js
/** sqlite3
const sequelize = new Sequelize({
	...Settings.db
})
*/
let sequelize = new Sequelize(Settings.db.database, Settings.db.user, Settings.db.password, {
	...Settings.db
});
```

Вот и всё. Остальной код должен продолжить работать как и прежде.

Выполним миграцию

`npm run dbinit`

После этого запустим сервер

`npm start`

У нас имеются тесты, которые позволят проверить работоспособность системы

`npm run test:api`

