describe('Filter: {{ name }}', function () {
	var {{ name }};

	beforeEach(function () {
		// Load the filters's module
		module('{{ module }}');

		// Provide any mocks needed
		module(function ($provide) {
			{%- for dep in deps %}
			provide.value('{{ dep }}', {});
			{%- endfor %}
		});

		// Inject in angular constructs otherwise,
		//	you would need to inject these into each test
		inject(function ($filter{{ _deps_ | ljoined }}) {
			{{ name }} = $filter('{{ name }}');

			{% for dep in deps -%}
			{{ dep }} = _{{ dep }}_;
			{% endfor %}
		});
	});

});