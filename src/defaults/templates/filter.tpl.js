describe('Filter: {{name}}', function () {
	var {{name}};

	beforeEach(function () {

		module('{{module}}');

		module(function ($provide) {
			{{#each deps}}
			{{> (this.partial) this}}
			{{/each}}
		});

		inject(function ($filter{{and arg._deps_ }}) {
			{{name}} = $filter('{{name}}');

			{{#each deps}}
			{{this.name}} = _{{this.name}}_;
			{{/each}}
		});
	});

	// Specs here

});