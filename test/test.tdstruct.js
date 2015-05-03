
var tdstruct = ['div.tdstruct1', ['span'], ['a', {name:'link1'}], ['div', ['div.d1',['pre']]]];
var svgstruct = ['svg.svgtest', {
			"width": "100%",
			"height": "100%",
			"viewBox": "0 0 18 18",
			"version": "1.1",
			"xml:space": "preserve",
			"style": "fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"
		},
		['g', {
			"transform": "matrix(1,0,0,1,-5.41964,-6.01351)"
		},
		['rect', {
			"x": "5.41964",
			"y": "6.01351",
			"width": "18.8155",
			"height": "18.603",
			"style": "fill:none;"
		}]
	]
];

describe('TDStruct', function () {
	it('should convert tdstruct to element', function () {
		var a = $$$(['div']);
		document.body.appendChild(a);
		assert(a.tagName === 'DIV', 'is not a div tag');
	});
	it('should take a nested tdstruct and construct a DOM', function (done) {
		$$$.appendToDoc(tdstruct).then(function () {
			var t1 = document.querySelector('.tdstruct1');
			assert(t1.tagName === 'DIV', 'no tagName from tdstruct'); 
			assert(t1.firstChild.tagName === 'SPAN', 'no tagName on first child');
			assert(t1.firstChild.nextSibling.getAttribute('name') === 'link1', 'no attribute on node');
			assert(t1.lastChild.lastChild.classList.contains('d1'), 'no className in div element');
			assert(t1.lastChild.lastChild.lastChild.tagName === 'PRE', 'no third level element');
			done();
		})
	});
	it('should structify a DOM element into tdstruct', function (done) {
		var t1 = document.querySelector('.tdstruct1');
		var tds1 = $$$.structify(t1);
		assert(Array.isArray(tds1), 'structify doesn\'t return an array');
		assert(tds1.length === 4, 'the array length is wrong');
		assert(JSON.stringify(tds1) === JSON.stringify(tdstruct), 'the structified string is not equal to the original');
		done();
	});
	it('should construct a SVG DOM', function (done) {
		$$$.appendToDoc(svgstruct).then(function () {
			var svg = $$$.query('svg');
			assert(svg.tagName === 'svg', 'no SVG was created');
			done();
		});
	});
	it('should structify a SVG DOM', function (done) {
		$$$.setImmediate(function () {
			var svg = $$$.query('svg');
			var tds2 = $$$.structify(svg);
			assert(tds2[1].viewBox === "0 0 18 18", 'no tdstruct was created');
			done();
		});
	});
})
