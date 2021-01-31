const { CurrencyController } = require(`${global.baseDir}/controllers/CurrencyController.js`),
	  { Validator }          = require('secval');

module.exports = ({ app, BASE }) => {
	
	BASE = BASE + '/currencies';
	
	app.get(`${BASE}`, async (req, res) => {
		return new CurrencyController().list(req, res);
	});
	
	app.get(`${BASE}/:code([a-z]{3})`, async (req, res) => {
		const [err, options] = new Validator()
		.with(req.params)
		.arg('code').required.string.exactly(3).toLowerCase
		.build();
		
		if (err) {
			return res.sendErr(400, err);
		}

		return new CurrencyController().get(req, res, options);
	});
	
	app.post(`${BASE}`, async (req, res) => {
		const [err, options] = new Validator()
		.with(req.body)
		.arg('isoCode').required.string.exactly(3).toLowerCase
		.arg('name').required.string.min(1).max(200)
		.arg('symbol').required.string
		.arg('subunit').required.string.min(1).max(200)
		.arg('isoNumeric').required.regular(/[0-9]+/)
		.arg('rate').required.float.min(0.001)
		.build();
		
		if (err) {
			return res.sendErr(400, err);
		}
		
		return new CurrencyController().create(req, res, options);
	});
	
	app.delete(`${BASE}/:code([a-z]{3})`, async (req, res) => {
		const [err, options] = new Validator()
		.with(req.params)
		.arg('code').required.string.exactly(3).toLowerCase
		.build();
		
		if (err) {
			return res.sendErr(400, err);
		}

		return new CurrencyController().remove(req, res, options);
	});
	
	app.put(`${BASE}/:code([a-z]{3})`, async (req, res) => {
		const [err, options] = new Validator()
		.with(req.params)
		.arg('code').required.string.exactly(3).toLowerCase
		.with(req.body)
		.arg('rate').required.float.min(0.001)
		.build();
		
		if (err) {
			return res.sendErr(400, err);
		}

		return new CurrencyController().update(req, res, options);
	});
	
}