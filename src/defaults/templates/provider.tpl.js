{{#if opts.useStrict}}
'use strict';

{{/if}}
describe('Provider: {{name}}', function () {

	var {{name}}{{and arg.deps}};

	var init = function () {
		inject(function (_{{name}}_{{and arg._deps_}}) {
			{{name}} = _{{name}}_;
			{{#each deps}}
			{{this.name}} = _{{this.name}}_;
			{{/each}}
		});
	};

	beforeEach(function () {
		module('{{module}}');

		module(function ($provide) {
			{{#each deps}}
			{{> (this.partial) this}}
			{{/each}}
		});
	});

	// Specs here
	{{#if opts.includeSamples}}
	/*
	it('should return a default value', function () {
		init();
		expect({{name}}.foo()).toBe('qux');
	});

	it('should return a method value', function () {
		module(function ({{name}}Provider) {
			{{name}}Provider.set('tux');
		});
		init();
		expect({{name}}.foo()).toBe('tux');
	});
	*/
	{{/if}}

});