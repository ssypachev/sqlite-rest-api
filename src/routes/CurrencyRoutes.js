const { CurrencyService } = require(`${global.baseDir}/services/CurrencyService.js`);

module.exports = ({ app, BASE }) => {
	
	BASE = BASE + '/currencies';
	
	app.get(`${BASE}`, async (req, res) => {
		const list = await new CurrencyService().list();
		return res.json(list);
	});
	
	app.get(`${BASE}/:code([a-z]{3})`, async (req, res) => {
		const code = req.params.code;
		const currency = await new CurrencyService().get(code);
		if (currency === null) {
			return res.status(404).send(`Currency specified by code ${code} not found`);
		}
		return res.json(currency);
	});
	
	app.post(`${BASE}`, async (req, res) => {
		const currency = req.body;
		const err = await new CurrencyService().create(currency);
		if (err === 409) {
			return res.status(409).send(`Duplicate entry. Currency ${req.body.iso_code} exists`);
		}
		return res.json(true);
	});
	
	app.delete(`${BASE}/:code([a-z]{3})`, async (req, res) => {
		const code = req.params.code;
		const err = await new CurrencyService().remove(code);
		if (err === 404) {
			return res.status(404).send(`Currency specified by code ${code} not found`);
		}
		return res.json(true);
	});
	
	app.put(`${BASE}/:code([a-z]{3})`, async (req, res) => {
		const code = req.params.code;
		const rate = req.body.rate;
		const err = await new CurrencyService().update(code, { rate });
		if (err === 404) {
			return res.status(404).send(`Currency specified by code ${code} not found`);
		}
		return res.json(true);
	});
	
}