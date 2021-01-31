module.exports = ({ app, BASE }) => {
	
	BASE = BASE + '/currencies';
	
	app.get(`${BASE}`, async (req, res) => {
		return res.send("OK");
	});
	
}