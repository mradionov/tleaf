{{#if opts.useStrict}}
'use strict';

{{/if}}
describe('Component: {{name}}', function () {

	var component, bindings;
	var $scope, $componentController{{and arg.deps}};

	beforeEach(function () {

		module('{{module}}');

		module(function ($provide) {
			{{#each deps}}
			{{> (this.partial) this}}
			{{/each}}
		});

		inject(function ($rootScope, _$componentController_{{and arg._deps_}}) {
			bindings = {};
			$scope = $rootScope.$new();
			$componentController = _$componentController_;
			{{#each deps}}
			{{this.name}} = _{{this.name}}_;
			{{/each}}
		});

	});

	// Specs here
	{{#if opts.includeSamples }}
	/*
	it('should return a property value', function () {
		component = $componentController('{{name}}', {
			$scope: $scope
		}, bindings);
		expect(component.foo).toBe('bar');
	});

	it('should return a method value', function () {
		component = $componentController('{{name}}', {
			$scope: $scope
		}, bindings);
		expect(component.baz()).toBe('qux');
	});
	*/
	{{/if}}

});