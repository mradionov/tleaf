{{#if opts.useStrict}}
'use strict';

{{/if}}
describe('Directive: {{name}}', function () {

	var template, element;
	var $scope, $compile{{and arg.deps}};

	beforeEach(function () {
		module('{{module}}');

		module(function ($provide) {
			{{#each deps}}
			{{> (this.partial) this}}
			{{/each}}
		});

		inject(function ($rootScope, _$compile_{{and arg._deps_}}) {
			$scope = $rootScope.$new();
			$compile = _$compile_;
			{{#each deps}}
			{{this.name}} = _{{this.name}}_;
			{{/each}}
		});
	});

	// Specs here
	{{#if opts.includeSamples}}
	/*
	it('should make a hidden element visible', inject(function ($compile) {
		template = '<{{dashCase name}}></{{dashCase name}}>';
		element = $compile(template)($scope);
		expect(element.text()).toBe('this is the {{name}} directive');
	}));
	*/
	{{/if}}

});