describe('Factory: {{name}}', function () {
	var {{name}};

	beforeEach(function () {
		// Load factory's module
		module('{{module}}');

		// Provide any mocks needed
		module(function ($provide) {
			{{#each deps}}
			{{> (this.getType) this}}
			{{/each}}
		});

		// Inject in anuglar constructs otherwise,
		//	you would need to inject these into each test
		inject(function (_{{name}}_{{and arg._deps_}}) {
			{{name}} = _{{name}}_;

			{{#each deps}}
			{{this.name}} = _{{this.name}}_;
			{{/each}}
		});
	});

});