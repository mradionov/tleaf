{{>useStrict}}
describe('Value: {{name}}', function () {

	var {{name}};

	beforeEach(function () {

		module('{{module}}');

		inject(function (_{{name}}_) {
			{{name}} = _{{name}}_;
		});
	});

	// Specs here

});