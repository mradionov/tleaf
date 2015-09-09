{{>useStrict}}
describe('Provider: {{name}}', function () {
	var {{name}}Provider;

	beforeEach(function () {
		module('{{module}}', function () {
			{{name}}Provider = _{{name}}Provider_;
		});
	});

	// Specs here

});