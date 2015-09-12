{{>useStrict}}
describe('Provider: {{name}}', function () {
	var {{name}}Provider;

	beforeEach(function () {
		module('{{module}}', function (_{{name}}Provider_) {
			{{name}}Provider = _{{name}}Provider_;
		});
	});

	// Specs here

});