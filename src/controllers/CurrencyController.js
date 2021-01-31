const { CurrencyService } = require(`${global.baseDir}/services/CurrencyService.js`);

class CurrencyController {
	
	async list (req, res) {
		const [err, list] = await new CurrencyService().list();
		if (err) {
			return res.status(500).send(err);
		}
		return res.json(list);
	}
	
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
	
	async create (req, res, currency) {
		const [err,] = await new CurrencyService().create(currency);
		if (err === 409) {
			return res.status(409).send(`Duplicate entry. Currency ${req.body.iso_code} exists`);
		}
		if (err !== null) {
			return res.status(500).send(err);
		}
		return res.json(true);
	}
	
	async remove (req, res, { code }) {
		const [err,] = await new CurrencyService().remove(code);
		if (err === 404) {
			return res.status(404).send(`Currency specified by code ${code} not found`);
		}
		if (err !== null) {
			return res.status(500).send(err);
		}
		return res.json(true);
	}
	
	async update (req, res, { code, rate }) {
		const [err, ] = await new CurrencyService().update(code, { rate });
		if (err === 404) {
			return res.status(404).send(`Currency specified by code ${code} not found`);
		}
		if (err !== null) {
			return res.status(500).send(err);
		}
		return res.json(true);
	}
	
}

module.exports.CurrencyController = CurrencyController;