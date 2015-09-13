{{#if opts.useStrict}}
'use strict';

{{/if}}
describe('Filter: {{name}}', function () {

	var {{name}};

	beforeEach(function () {

		module('{{module}}');

		module(function ($provide) {
			{{#each deps}}
			{{> (this.partial) this}}
			{{/each}}
		});

		inject(function ($filter{{and arg._deps_ }}) {
			{{name}} = $filter('{{name}}');
			{{#each deps}}
			{{this.name}} = _{{this.name}}_;
			{{/each}}
		});
	});

	// Specs here
	{{#if opts.includeSamples}}
	/*
	it('should run the filter on a text', function () {
		var text = 'foo';
		expect({{name}}(text)).toBe('{{name}} filter: ' + text);
	});
	*/
	{{/if}}

});