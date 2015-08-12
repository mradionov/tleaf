describe('Directive: {{name}}', function () {
	var element, scope, compile, defaultData,
			validTemplate = '<{{dashCase name}} ng-model="data"></{{dashCase name}}>';

	function createDirective(data, template) {
		var elm;

		// Setup scope state
		scope.data = data || defaultData;

		// Create directive
		elm = compile(template || validTemplate)(scope);

		// Trigger watchers
		//scope.$apply();

		// Return
		return elm;
	}

	beforeEach(function () {

		// Load the directive's module
		module('{{module}}');

		// Reset data each time
		defaultData = 42;

		// Provide any mocks needed
		module(function ($provide) {
			{{#each deps}}
			{{> (this.provider) this}}
			{{/each}}
		});

		// Inject in angular constructs otherwise,
		//	you would need to inject these into each test
		inject(function ($rootScope, $compile{{and  arg._deps_ }}) {
			scope = $rootScope.$new();
			compile = $compile;

			{{#each deps}}
			{{this.name}} = _{{this.name}}_;
			{{/each}}
		});
	});

});