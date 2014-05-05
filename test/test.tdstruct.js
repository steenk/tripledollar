
describe('TDStruct', function () {
	it('should convert tdstruct to element', function () {
		var a = $$$(['div']);
		document.body.appendChild(a);
		assert(a.tagName === 'DIV', 'is not a div tag');
	});


})
