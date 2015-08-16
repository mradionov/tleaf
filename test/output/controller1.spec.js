describe('Controller: FirstCtrl', function () {

	var scope, FirstCtrl, MyService1, MyService2, $state;

	// Initialize the controller and scope
	beforeEach(function () {

		// Load the controller's module
		module('app');

		module(function ($provide) {
			$provide.service('MyService1', function () {
			
			});
			$provide.service('MyService2', function () {
			
			});
			$provide.provider('$state', function () {
				this.$get = function () {
					return {};
				};
			});
		});

		// Inject in angular constructs otherwise,
		//	you would need to inject these into each test
		inject(function ($controller, _MyService1_, _MyService2_, _$state_) {
			scope = {};

			MyService1 = _MyService1_;
			MyService2 = _MyService2_;
			$state = _$state_;

			FirstCtrl = $controller('FirstCtrl', {
				$scope: scope
			});
		});

	});
});