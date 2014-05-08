
describe('Helper Functions', function () {
	it('should have a css helper method', function () {
		var a = $$$('div').css({color: 'maroon', backgroundColor: 'gold'});
		document.body.appendChild(a);
		assert(a.style.color = 'maroon', 'no style is set');
		assert(a.getAttribute('style').indexOf('background-color') >= 0, 'no convertion between camel case and hyphen separation');
	});
    it('should have a set helper method', function () {
		var b = $$$('div').set('helper', function () {return true;});
		assert(b.helper && b.helper(), 'no function is set');
	});
	it('should have a fun helper method', function () {
		var f = function (delim) {this.textContent = this.textContent.split('').join(delim);};
		var c = $$$('div', {style:'display:none'}, 'tripledollar').set('dash', f).fun('dash', '-');
		document.body.appendChild(c);
		assert(c.textContent === 't-r-i-p-l-e-d-o-l-l-a-r', 'the fun method is not working');
	});
	it('should have an evt helper method', function () {
		var d = $$$('div').evt('click', function (evt) {
			assert(evt.target === d, 'no working evt method');
		});
		d.dispatchEvent(new Event('click'));
	});
	it('should have an ins helper method', function () {
		var e = $$$('div').ins($$$('div')).ins(['ins']);
		document.body.appendChild(e);
		assert(e.childElementCount === 2, 'no working ins method');
	});
});
