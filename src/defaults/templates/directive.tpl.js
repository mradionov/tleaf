describe('Directive: {{ name }}', function () {
	var element, scope, compile, defaultData,
			validTemplate = '<{{ name | dashCase }} ng-model="data"></{{ name | dashCase }}>';

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
		module('{{ module }}');

		// Reset data each time
		defaultData = 42;

		// Provide any mocks needed
		module(function ($provide) {
			{%- for dep in deps %}
			provide.value('{{ dep }}', {});
			{%- endfor %}
		});

		// Inject in angular constructs otherwise,
		//	you would need to inject these into each test
		inject(function ($rootScope, $compile{{ _deps_ | ljoined }}) {
			scope = $rootScope.$new();
			compile = $compile;

			{% for dep in deps -%}
			{{ dep }} = _{{ dep }}_;
			{% endfor %}
		});
	});

});