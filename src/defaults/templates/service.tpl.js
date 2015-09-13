{{#if opts.useStrict}}
'use strict';

{{/if}}
describe('Service: {{name}}', function () {

	var {{name}}{{and arg.deps}};

	beforeEach(function () {
		module('{{module}}');

		module(function ($provide) {
			{{#each deps}}
			{{> (this.partial) this}}
			{{/each}}
		});

		inject(function (_{{name}}_{{and arg._deps_}}) {
			{{name}} = _{{name}}_;
			{{#each deps}}
			{{this.name}} = _{{this.name}}_;
			{{/each}}
		});
	});

	// Specs here
	{{#if opts.includeSamples}}
	/*
	it('should return a property value', function () {
		expect({{name}}.foo).toBe('bar');
	});

	it('should return a method value', function () {
		expect({{name}}.baz()).toBe('qux');
	});
	*/
	{{/if}}

});