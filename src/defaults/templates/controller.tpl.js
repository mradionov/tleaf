{{#if opts.useStrict}}
'use strict';

{{/if}}
describe('Controller: {{name}}', function () {

	var $scope, {{name}}{{and arg.deps}};

	beforeEach(function () {

		module('{{module}}');

		module(function ($provide) {
			{{#each deps}}
			{{> (this.partial) this}}
			{{/each}}
		});

		inject(function ($controller{{and arg._deps_}}) {
			$scope = {};
			{{#each deps}}
			{{this.name}} = _{{this.name}}_;
			{{/each}}

			{{name}} = $controller('{{name}}', {
				$scope: $scope
			});
		});

	});

	// Specs here
	{{#if opts.includeSamples }}
	/*
	it('should return a property value', function () {
		expect($scope.foo).toBe('bar');
	});

	it('should return a method value', function () {
		expect($scope.baz()).toBe('qux');
	});
	*/
	{{/if}}

});