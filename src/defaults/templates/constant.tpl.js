describe('Constant: {{name}}', function () {

	var {{name}};

	beforeEach(function () {
		// Load the constant's module
		module('{{module}}');

		// Inject in angular constructs otherwise,
		//	you would need to inject these into each test
		inject(function (_{{name}}_) {
			{{name}} = _{{name}}_;
		});
	});

});