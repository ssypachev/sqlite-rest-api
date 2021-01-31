const chai      = require('chai'),
      chaiHttp  = require('chai-http');
	  
chai.use(chaiHttp);

describe('Should test currency routes', async () => {
	
	
	const HOST = "http://localhost:3233";
	
	it ('Should test list', async () => {
		const res = await chai.request(HOST)
		.get('/api/v1/currencies');
		
		chai.expect(res).to.have.status(200);
		chai.expect(res.body).to.be.an('array');
	});
	
	it ('Should get one currency by code', async () => {
		const res = await chai.request(HOST)
		.get('/api/v1/currencies/rub');
		
		chai.expect(res).to.have.status(200);
		chai.expect(res.body).to.be.an('object');
		chai.expect(res.body).to.deep.equal({
			"isoCode":  "rub",
			"name": 	"Russian Ruble",
			"symbol": 	"₽",
			"subunit": 	"Kopeck",
			"isoNumeric": "643",
			"rate":		75.96
		});
	});
	
	it ('Should fail to get qqq currency', async () => {
		const res = await chai.request(HOST)
		.get('/api/v1/currencies/qqq');
		
		chai.expect(res).to.have.status(404);
	});
	
	it ('Should test usecase: create, find, delete, find', async () => {
		let res = await chai.request(HOST)
		.post('/api/v1/currencies')
		.send({
			"isoCode": "sar",
			"name": "Saudi Riyal",
			"symbol": "ر.س",
			"subunit": "Hallallah",
			"isoNumeric": "682",
			"rate": 0.27
		});
		
		chai.expect(res).to.have.status(200);
		
		res = await chai.request(HOST)
		.get('/api/v1/currencies');
		
		chai.expect(res).to.have.status(200);
		
		let sar = res.body.find(x => x.isoCode === 'sar');
		chai.expect(sar).not.to.be.null;
		
		res = await chai.request(HOST)
		.delete('/api/v1/currencies/sar');
		
		chai.expect(res).to.have.status(200);
		
		res = await chai.request(HOST)
		.get('/api/v1/currencies');
		
		chai.expect(res).to.have.status(200);
		
		sar = res.body.find(x => x.isoCode === 'sar');
		chai.expect(sar).to.be.undefined;
	});
	
});