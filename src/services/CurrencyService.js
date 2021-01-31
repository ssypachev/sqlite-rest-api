const { CurrencyModel } = require(`${global.baseDir}/models/CurrencyModel.js`),
	  { Op } = require('sequelize');

class CurrencyService {
	
	async list () {
		try {
			//Получить все строки таблицы
			const currencies = await CurrencyModel.findAll();
			return [null, currencies];
		} catch (err) {
			return [err, null];
		}
	}
	
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
	
}

module.exports.CurrencyService = CurrencyService;