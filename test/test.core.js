
var xhr = new XMLHttpRequest();
xhr.open('GET', '../package.json', false);
xhr.onload = function () {
	var r = this.response;
	var package = JSON.parse(r);
	
	describe("Core", function () {
		it('should have a $$$ object in window', function () {
			assert(window.$$$ !== undefined, 'window.$$$ should be there');
		});
		it('should have a version', function () {
			assert($$$.version, 'version is not there');
		});
		it('should be the version ' + package.version, function () {
			assert($$$.version === package.version, 'version is ' + $$$.version);
		});
		it('should have the div tagname', function () {
			var div = $$$('div');
			document.body.appendChild(div);
			assert(div.tagName === 'DIV', 'not a div');
		});
		it('should produce id from ident string', function () {
			var a = $$$('div#a')
			,	b = $$$('div.e#b')
			,	c = $$$('div#c.f');
			document.body.appendChild(a);
			document.body.appendChild(b);
			document.body.appendChild(c);
			assert(a.id === 'a', 'id is wrong');
			assert(b.id === 'b', 'id is wrong');
			assert(c.id === 'c', 'id is wrong');
		});
		it('should produce classnames from ident string', function () {
			var d = $$$('div.g#d.h.i');
			document.body.appendChild(d);
			assert(d.classList.contains('g'), 'no "g" class');
			assert(d.classList.contains('h'), 'no "h" class');
			assert(d.classList.contains('i'), 'no "i" class');
		});
		it('should produce a nested structure', function () {
			var e = $$$('div', $$$('div'), $$$('div'));
			document.body.appendChild(e);
			assert(e.children.length === 2, 'number of children is wrong');
		});
		it('should set attributes', function () {
			var f = $$$('div', {name: 'f', style:'display:block'});
			document.body.appendChild(f);
			assert(f.getAttribute('name') === 'f', 'no name attribute');
			assert(f.style.display === 'block', 'the style attribute is wrong');
		});
		it('should produce a text content', function () {
			var g = $$$('div', {style:'display:none'}, 'Tripledollar');
			document.body.appendChild(g);
			assert(g.textContent === 'Tripledollar', 'no text content');
		});
	})
}
xhr.send();
