describe('Provider: {{name}}', function () {
	var {{name}};

	beforeEach(function () {

		// Initialize the service provider by injecting it
		//	to a fake module's config block
		angular
			.module('test.{{module}}', [])
			.config(function (_{{name}}Provider_) {
				{{name}} = _{{name}}Provider_;
			});

		// Initialize {{module}} injector
		module('{{module}}', 'test.{{module}}');

		// Kickstart the injectors registered with calls to angular.mock.module
		inject(function () {});
	});

	// Specs here

});