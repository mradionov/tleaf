describe('Filter: {{name}}', function () {
	var {{name}};

	beforeEach(function () {
		// Load the filters's module
		module('{{module}}');

		// Provide any mocks needed
		module(function ($provide) {
			{{#each deps}}
			{{> (this.getType) this}}
			{{/each}}
		});

		// Inject in angular constructs otherwise,
		//	you would need to inject these into each test
		inject(function ($filter{{and arg._deps_ }}) {
			{{name}} = $filter('{{name}}');

			{{#each deps}}
			{{this.name}} = _{{this.name}}_;
			{{/each}}
		});
	});

});