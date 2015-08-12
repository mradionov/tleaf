describe('Controller: FirstCtrl', function () {

	var scope, FirstCtrl, $state, MyService1, MyService2;

	// Initialize the controller and scope
	beforeEach(function () {

		// Load the controller's module
		module('app');

		module(function ($provide) {
			$provide.provider('$state', function () {
				this.$get = function () {
					return {};
				};
			});
			$provide.service('MyService1', function () {
			
			});
			$provide.service('MyService2', function () {
			
			});
		});

		// Inject in angular constructs otherwise,
		//	you would need to inject these into each test
		inject(function ($controller, _$state_, _MyService1_, _MyService2_) {
			scope = {};

			$state = _$state_;
			MyService1 = _MyService1_;
			MyService2 = _MyService2_;

			FirstCtrl = $controller('FirstCtrl', {
				$scope: scope
			});
		});

	});
});