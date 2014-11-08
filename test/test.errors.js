describe('Error handling', function () {
	it('should refuse to handle it if an object is the first element', function () {
		assert($$$({}) === undefined, 'it is not undefined');
	});
	it('should be a valid "ident" element', function () {
		assert($$$('this is wrong') === undefined, 'it is not a valid element');
	});
});

