
describe('Help Functions', function () {
	it('should have a css helper', function () {
		var a = $$$('div').css({color: 'maroon', backgroundColor: 'gold'});
		document.body.appendChild(a);
		assert(a.style.color = 'maroon', 'no style is set');
		assert(a.getAttribute('style').indexOf('background-color') >= 0, 'no convertion between camel case and hyphen separation');
	});

});
