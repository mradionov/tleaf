describe('Service: {{ unit.name }}', function () { 'use strict';

  var httpBackend;

  // Use to provide any mocks needed
  function _provide(callback) {
    // Execute callback with $provide
    module(function ($provide) {
      callback($provide);
    });
  }

  // Use to inject the code under test
  function _inject() {
    inject(function ($httpBackend{{ unit.deps | pluck('name') | toarg(true, '_')}}) {
      httpBackend = $httpBackend;

      {% for dep in unit.deps -%}
      {{ dep.name }} = _{{ dep.name }}_;
      {% endfor %}
    });
  }

  // Call this before each test, except where you are testing for errors
  function _setup() {
    // Mock any expected data
    _provide(function (provide) {
      {%- for dep in unit.deps %}
      provide.value('{{ dep.name }}', {});
      {%- endfor %}
    });

    // Inject the code under test
    _inject();
  }

  beforeEach(function () {
    // Load the service's module
    module('{{ unit.module.name }}')
  });

  // make sure no expectations were missed in your tests.
  // (e.g. expectGET or expectPOST)
  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  ////////

});