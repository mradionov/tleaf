describe('Controller: {{ unit.name }}', function () { 'use strict';

  var scope, {{ unit.name }}{{ unit.deps | pluck('name') | toarg(true) }};

  beforeEach(function () {

    module('{{ unit.module.name }}');

    module(function ($provide) {

      {%- for dep in unit.deps %}
      $provide.value('{{ dep.name }}', {});
      {%- endfor %}
    });

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

});