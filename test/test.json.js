describe("JSON", function () {
	it('should be able to parse a JSON string', function (done) {
		let json = '["h1.testing#json-1", "Testing"]';

		$$$.appendToDoc($$$.parse(json))
		.then(function () {
			let elem = document.getElementById('json-1');
			assert(elem.className === 'testing', 'the JSON has not created an element');
			done();
		});
	});
	it('should fail if it is not a JSON', function (done) {
		let obj = ["h1.testing#json-1", "Testing"];
		let elem = $$$.parse(obj)
		assert(typeof(elem) === 'undefined', 'Throws error because not a JSON');
		done();
	});
	it('should create a JSON from a DOM object', function (done) {
		let dom = document.getElementById('mocha-stats');
		let json = $$$.stringify(dom);
		assert(json.startsWith('["ul#mocha-stats"'), 'should be a JSON string of the DOM');
		done();
	})
});
