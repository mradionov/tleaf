{{#if opts.useStrict}}
'use strict';

{{/if}}
describe('Value: {{name}}', function () {

	var {{name}};

	beforeEach(function () {

		module('{{module}}');

		inject(function (_{{name}}_) {
			{{name}} = _{{name}}_;
		});
	});

	// Specs here
	{{#if opts.includeSamples}}
	/*
	it('should return a value', function () {
		expect({{name}}).toBe(42);
	});
	*/
	{{/if}}

});