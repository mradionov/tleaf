// TODO: mock service?
// TODO: controller as
describe('Controller: {{name}}', function () {

	var scope, {{name}}{{and arg.deps}};

	// Initialize the controller and scope
	beforeEach(function () {

		// Load the controller's module
		module('{{module}}');

		module(function ($provide) {
			{{#each deps}}
			{{> (this.getType) this}}
			{{/each}}
		});

		// Inject in angular constructs otherwise,
		//	you would need to inject these into each test
		inject(function ($controller{{and arg._deps_}}) {
			scope = {};

			{{#each deps}}
			{{this.name}} = _{{this.name}}_;
			{{/each}}

			{{name}} = $controller('{{name}}', {
				$scope: scope
			});
		});

	});
});