window.setImmediate = null;
describe('Timer', function () {
	it('should have a setImmediate function', function () {
		assert(typeof $$$.setImmediate === 'function', 'no setImmediate function');
	});
	it('should be asynchronous', function (done) {
		var a = [];
		a.push(1);
		$$$.setImmediate(function () {a.push(2)});
		a.push(3);
		$$$.setImmediate(function () {
			assert((a[0] === 1 && a[1] === 3 && a[2] === 2), 'it is not asynchronous ' + a);
			done();
		});
	});
	it('should take arguments', function (done) {
		function b (c, d) {
			assert(c + d === 3, 'arguments doesn\'t work');
			done();
		}
		$$$.setImmediate(b, 1, 2);
	});
});
