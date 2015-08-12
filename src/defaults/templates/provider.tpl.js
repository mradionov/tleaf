describe('Provider: {{name}}', function () {
  var {{name}};

  beforeEach(function () {

    // Initialize the service provider by injecting it
    //  to a fake module's config block
    angular
      .module('test.{{module}}', function () {})
      .config(function (_{{name}}_) {
        {{name}} = _{{name}}_;
      });

    // Initialize {{module}} injector
    module('{{module}}', 'test.{{module}}');

    // Kickstart the injectors registered with calls to angular.mock.module
    inject(function () {});
  });

});