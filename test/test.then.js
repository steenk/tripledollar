window.setImmediate = null;
var p = new Promise(function (f) {f('promised');});
describe('Then', function () {
	it('should be a Promise returned from "appendToDoc"', function (done) {
		var e = $$$('div', {style:'display:none'}, 'first');
		$$$.appendToDoc(e)
			.then(function () {e.textContent = 'second'})
			.then(function () {
				assert(e.textContent === 'second', 'then is not working');
				done();
		});
	});
	it('then should return a value to the next then', function (done) {
		var e = $$$('div', {style:'display:none'});
		$$$.appendToDoc(e)
			.then(function () {return 10;})
			.then(function (value) {
				assert(value === 10, 'value should be 11');
				done();
		});
	});
	it('when then returnd a promise, the next then will be given it\'s value when fulfilled', function (done) {
		var e = $$$('div', {style:'display:none'});
		$$$.appendToDoc(e)
			.then(function () {return p;})
			.then(function (value) {
				assert(value === 'promised', 'value should be the value of a fulfilled promise');
				done();
		});
	});
	it('should be a "then" method in "appendToDoc when there is no Promise"', function (done) {
		var e = $$$('div', {style:'display:none'}, 'first');
		Promise = undefined;
		$$$.appendToDoc(e)
			.then(function () {e.textContent = 'second'})
			.then(function () {
				assert(e.textContent === 'second', 'then is not working');
				done();
		});
	});	
	it('should be able to handle "thenables" even when there is no Promise"', function (done) {
		var e = $$$('div', {style:'display:none'}, 'first');
		$$$.appendToDoc(e)
			.then(function () {
				return p;
			})
			.then(function (value) {
				assert(value === 'promised', 'value of a promise');
				done();
		});
	});	
});
