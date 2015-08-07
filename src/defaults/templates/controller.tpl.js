// TODO: mock service?
// TODO: controller as
describe('Controller: {{ name }}', function () {

  var scope, {{ name }}{{ deps | ljoined }};

  // Initialize the controller and scope
  beforeEach(function () {

    // Load the controller's module
    module('{{ module }}');

    // Provide any mocks needed
    module(function ($provide) {
      {%- for dep in deps %}
      $provide.value('{{ dep }}', {});
      {%- endfor %}
    });

    // Inject in angular constructs otherwise,
    //  you would need to inject these into each test
    inject(function ($controller{{ _deps_ | ljoined }}) {
      scope = {};

      {% for dep in deps -%}
      {{ dep }} = _{{ dep }}_;
      {% endfor %}

      {{name}} = $controller('{{name}}', {
        $scope: scope
      });
    });

  });

});