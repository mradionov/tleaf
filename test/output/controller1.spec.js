describe('Value: MyValue', function () {

	var MyValue;

	beforeEach(function () {
		// Load the value's module
		module('app');

		// Inject in angular constructs otherwise,
		//	you would need to inject these into each test
		inject(function (_MyValue_) {
			MyValue = _MyValue_;
		});
	});

});