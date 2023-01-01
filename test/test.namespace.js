describe("Namespace", function () {
	it('should handle a SVG namespace', done => {
		var svg = $$$('svg:svg.svg-test');
		$$$.appendToDoc(svg)
		.then(() => {
			let elem = document.querySelector('svg.svg-test');
			assert(elem.namespaceURI === 'http://www.w3.org/2000/svg', 'namespace not used');
			done();
		})
	});
	it('should handle a custom namespace', done => {
		$$$.namespace('td', 'http://tripledollar.net');
		var td = $$$('td:box.td-box');
		$$$.appendToDoc(td)
		.then(() => {
			let elem = document.querySelector('.td-box');
			assert(elem.namespaceURI === 'http://tripledollar.net', 'namespace not created');
			done();
		})
	})
})