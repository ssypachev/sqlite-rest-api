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
		return Object
			.values(currencies)
			.sort((a, b) => a.iso_code.localeCompare(b.iso_code));
	}
	
	async get (code) {
		if (currencies.hasOwnProperty(code)) {
			return currencies[code];
		}
		return null;
	}
	
	async create (currency) {
		if (currencies.hasOwnProperty(currency.iso_code.toLowerCase())) {
			return 409;
		}
		currencies[currency.iso_code.toLowerCase()] = currency;
		return null;
	}
	
	async remove (code) {
		if (currencies.hasOwnProperty(code)) {
			delete currencies[code];
			return null;
		}
		return 404;
	}
	
	async update (code, { rate }) {
		if (currencies.hasOwnProperty(code)) {
			currencies[code].rate = rate;
			return null;
		}
		return 404;
	}
	
}

module.exports.CurrencyService = CurrencyService;