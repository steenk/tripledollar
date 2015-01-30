
var tdstruct = ['div.tdstruct1', ['span'], ['a', {name:'link1'}], ['div', ['div.d1',['pre']]]];

describe('TDStruct', function () {
	it('should convert tdstruct to element', function () {
		var a = $$$(['div']);
		document.body.appendChild(a);
		assert(a.tagName === 'DIV', 'is not a div tag');
	});
	it('should take a nested tdstruct and construct a DOM', function () {
		$$$.appendToDoc(tdstruct).then(function () {
			var t1 = document.querySelector('.tdstruct1');
			assert(t1.tagName === 'DIV', 'no tagName from tdstruct'); 
			assert(t1.firstChild.tagName === 'SPAN', 'no tagName on first child');
			assert(t1.firstChild.nextSibling.getAttribute('name') === 'link1', 'no attribute on node');
			assert(t1.lastChild.lastChild.classList.contains('d1'), 'no className in div element');
			assert(t1.lastChild.lastChild.lastChild.tagName === 'PRE', 'no third level element');
			it('should structify a DOM element into tdstruct', function () {
				var t1 = document.querySelector('.tdstruct1');
				var tds1 = $$$.structify(t1);
				assert(Array.isArray(tds1), 'structify doesn\'t return an array');
				assert(tds1.length === 4, 'the array length is wrong');
				assert(JSON.stringify(tds1) === JSON.stringify(tdstruct), 'the structified string is not equal to the original');
			});
		})
	})
})
