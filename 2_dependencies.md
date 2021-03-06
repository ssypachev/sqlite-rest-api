@ 2_dependencies

Начнём добавлять зависимости – библиотеки, которые будут использоваться во время работы. Эти зависимости будут дополнять в дальнейшем, с усложнением проекта.
Добавлять зависимости можно двумя способами

1.	Непосредственно писать зависимость руками в файл package.json. Это удобно, например, при переносе проекта
2.	Добавлять зависимости командами пакетного менеджера

`npm install`

Первым делом создаём lock файл. Он описывает дерево, которое было сгенерировано при создании проекта, независимо от следующих обновлений пакетов, чтобы получить полностью идентичный проект.
Добавим пару зависимостей
`npm install cross-env –g`
Это глобальная зависимость (она теперь видна всем проектам в системе и её можно вызвать из командной строки), которая позволяет кроссплатформенно работать с параметрами среды. Это позволит упростить работу, отделив тестирование, разработку и рабочее решение.
`npm install --save express express-async-errors`
Это минимальный набор пакетов. Который необходим на начальном этапе для запуска сервера
`--save` означает, что пакеты устанавливаются в проект локально, и кроме этого проекта нигде не видны.
Заметьте, что после этого в файле `package.json` появилось новое поле `dependencies`, которое содержит версии пакетов. Также появилась папка `node_modules`, в которой располагаются все зависимости.
Можно удалить эту папку. А после этого вновь переустановить все пакеты, набрав 
`npm install`
Кроме библиотек, которые будут использованы в релизе проекта, нам нужны ещё зависимости на время разработки, которые в релизе использоваться не будут. Добавим библиотеки тестирования мокка и чай
`npm install --save-dev mocha chai chai-http`
Заметьте, что в `package.json` появилось новое поле `devDependencies`, потому что мы использовали опцию `-–save-dev`
Если вы используете VCS, то не забудьте добавить в `.gitignore` папку `node_modules`. Она содержит очень много файлов, которые не нужно хранить, так как они автоматически подтягиваются при установке.

Осталось добавить код сервера в наш скрипт `src/index.js`, и мы получим работающий веб сервер
```js
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
```

Запустим сервер
`npm start`
Теперь сервер висит на порту `3233`
Если попытаться зайти на сервер из браузера, то он выдаст ошибку 404, потому что пока ни один рут не объявлен.

