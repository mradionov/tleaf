{{>useStrict}}
describe('Directive: {{name}}', function () {
	var $scope, $compile{{and arg.deps}};
	var element, defaultData;
	var validTemplate = '<{{dashCase name}} ng-model="data"></{{dashCase name}}>';

	function createDirective(data, template) {
		var elm;

		$scope.data = data || defaultData;

		elm = $compile(template || validTemplate)($scope);

		// Trigger watchers
		// $scope.$apply();

		return elm;
	}

	beforeEach(function () {

		module('{{module}}');

		// Reset data each time
		defaultData = 42;

		module(function ($provide) {
			{{#each deps}}
			{{> (this.partial) this}}
			{{/each}}
		});

		inject(function (_$rootScope_, _$compile_{{and arg._deps_ }}) {
			$scope = _$rootScope_.$new();
			$compile = _$compile_;
			{{#each deps}}
			{{this.name}} = _{{this.name}}_;
			{{/each}}
		});
	});

	// Specs here

});