describe('Service: MyService', function () {

	var httpBackend;

	// Use to provide any mocks needed
	function _provide(callback) {
		// Execute callback with $provide
		module(function ($provide) {
			callback($provide);
		});
	}

	// Use to inject the code under test
	function _inject() {
		inject(function ($httpBackend, _$http_) {
			httpBackend = $httpBackend;

			$http = _$http_;
		});
	}

	// Call this before each test, except where you are testing for errors
	function _setup() {
		// Mock any expected data
		_provide(function (provide) {
			provide.provider('$http', function () {
				this.$get = function () {
					return {};
				};
			});
		});

		// Inject the code under test
		_inject();
	}

	beforeEach(function () {
		// Load the service's module
		module('app')
	});

	// make sure no expectations were missed in your tests.
	// (e.g. expectGET or expectPOST)
	afterEach(function () {
		httpBackend.verifyNoOutstandingExpectation();
		httpBackend.verifyNoOutstandingRequest();
	});

});