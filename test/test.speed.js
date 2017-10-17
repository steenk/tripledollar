describe("Speed", function () {
	it('should generate DOM elements in a reasonable time', function (done) {
		var a = ['div.performance'], s, f, n = 2000;
		s = performance.now();
		while (n-- > 0) {
			a.push(['div#id' + n]);
		}
		$$$.appendToDoc($$$(a))
		.then(function () {
			f = performance.now();
			assert(f - s < 100, 'the time should not exceed 100 ms');
			done();
		});
	});
});
