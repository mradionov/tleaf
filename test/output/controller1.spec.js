// TODO: mock service?
// TODO: controller as
describe('Controller: FirstCtrl', function () {

	var scope, FirstCtrl, $scope, $state, MyService1, MyService2;

	// Initialize the controller and scope
	beforeEach(function () {

		// Load the controller's module
		module('app');

		// Provide any mocks needed
		module(function ($provide) {
			$provide.value('$scope', {});
			$provide.value('$state', {});
			$provide.value('MyService1', {});
			$provide.value('MyService2', {});
		});

		// Inject in angular constructs otherwise,
		//	you would need to inject these into each test
		inject(function ($controller, _$scope_, _$state_, _MyService1_, _MyService2_) {
			scope = {};

			$scope = _$scope_;
			$state = _$state_;
			MyService1 = _MyService1_;
			MyService2 = _MyService2_;
			

			FirstCtrl = $controller('FirstCtrl', {
				$scope: scope
			});
		});

	});

});