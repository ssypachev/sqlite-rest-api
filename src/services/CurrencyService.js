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

class CurrencyService {
	
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
	
	async create (currency) {
		try {
			if (currencies.hasOwnProperty(currency.iso_code.toLowerCase())) {
				return [409, null];
			}
			currencies[currency.iso_code.toLowerCase()] = currency;
			return [null, null];
		} catch (err) {
			return [err, null];
		}
	}
	
	async remove (code) {
		try {
			if (currencies.hasOwnProperty(code)) {
				delete currencies[code];
				return [null, null];
			}
			return [404, null];
		} catch (err) {
			return [err, null];
		}
	}
	
	async update (code, { rate }) {
		try {
			if (currencies.hasOwnProperty(code)) {
				currencies[code].rate = rate;
				return [null, null];
			}
			return [404, null];
		} catch (err) {
			return [err, null];
		}
	}
	
}

module.exports.CurrencyService = CurrencyService;