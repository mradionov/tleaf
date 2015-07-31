describe('Controller: {{ unit.name }}', function () { 'use strict';

  var scope, {{ unit.name }}{{ unit.deps | pluck('name') | toarg(true) }};

  // Initialize the controller and scope
  beforeEach(function () {

    // Load the controller's module
    module('{{ unit.module.name }}');

    // Provide any mocks needed
    module(function ($provide) {

      {%- for dep in unit.deps %}
      $provide.value('{{ dep.name }}', {});
      {%- endfor %}
    });

    // Inject in angular constructs otherwise,
    //  you would need to inject these into each test
    inject(function ($controller{{ unit.deps | pluck('name') | toarg(true, '_')}}) {
      scope = {};

      {% for dep in unit.deps -%}
      {{ dep.name }} = _{{ dep.name }}_;
      {% endfor %}

      {{unit.name}} = $controller('{{unit.name}}', {
        $scope: scope
      });
    });

  });

  ////////

});