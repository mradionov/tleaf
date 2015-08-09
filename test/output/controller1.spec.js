describe('Factory: MyFactory1', function () {
	var MyFactory1;

	beforeEach(function () {
		// Load factory's module
		module('app');

		// Provide any mocks needed
		module(function ($provide) {
			$provide.service('MyService1', function () {
			
			});
		});

		// Inject in anuglar constructs otherwise,
		//	you would need to inject these into each test
		inject(function (_MyFactory1_, _MyService1_) {
			MyFactory1 = _MyFactory1_;

			MyService1 = _MyService1_;
		});
	});

});