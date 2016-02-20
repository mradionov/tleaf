'use strict';

var assert = require('chai').assert;

var parse = require('./../../../src/parse');

describe('parse/deps', function () {

  it('should extract all implicit injections', function () {
    var source =
    "angular.module('test', []).controller('TestController', function (" +
    "   $scope, $rootScope, UserService, API_URL, moment) {});";

    var units = parse(source);

    assert.deepEqual(units, [{
      type: 'controller',
      name: 'TestController',
      module: { name: 'test' },
      deps: [
        { name: '$scope' },
        { name: '$rootScope' },
        { name: 'UserService' },
        { name: 'API_URL' },
        { name: 'moment' }
      ]
    }]);
  });

  it('should extract all explicit array injections', function () {
    var source =
    "angular.module('test', []).controller('TestController', [" +
    " '$scope', '$rootScope', 'UserService', 'API_URL', 'moment', function (" +
    " $scope, $rootScope, UserService, API_URL, moment) {}]);";

    var units = parse(source);

    assert.deepEqual(units, [{
      type: 'controller',
      name: 'TestController',
      module: { name: 'test' },
      deps: [
        { name: '$scope' },
        { name: '$rootScope' },
        { name: 'UserService' },
        { name: 'API_URL' },
        { name: 'moment' }
      ]
    }]);
  });

  it('should not extract filter args as deps', function () {
    var source =
    "angular.module('test', [])" +
    ".filter('testFilter', function (string, count) {});";

    var units = parse(source);

    assert.deepEqual(units, [{
      type: 'filter',
      name: 'testFilter',
      module: { name: 'test' },
      deps: []
    }]);
  });

  it('should extract provider deps from this', function () {
    var source =
    "angular.module('test', [])" +
    ".provider('testProvider', function () {" +
    " this.foo = 'bar';" +
    " this.$get = function ($rootScope) {};" +
    "});";

    var units = parse(source);

    assert.deepEqual(units, [{
      type: 'provider',
      name: 'testProvider',
      module: { name: 'test' },
      deps: [{ name: '$rootScope' }]
    }]);
  });

  it('should extract provider deps from this variable', function () {
    var source =
    "angular.module('test', [])" +
    ".provider('testProvider', function () {" +
    " var testGet = function ($rootScope) {};" +
    " this.$get = testGet;" +
    "});";

    var units = parse(source);

    assert.deepEqual(units, [{
      type: 'provider',
      name: 'testProvider',
      module: { name: 'test' },
      deps: [{ name: '$rootScope' }]
    }]);
  });

  it('should extract provider deps from return object', function () {
    var source =
    "angular.module('test', [])" +
    ".provider('testProvider', function () {" +
    " return {" +
    "   $get: function ($rootScope) {}" +
    " };" +
    "});";

    var units = parse(source);

    assert.deepEqual(units, [{
      type: 'provider',
      name: 'testProvider',
      module: { name: 'test' },
      deps: [{ name: '$rootScope' }]
    }]);
  });

  it('should extract provider deps from return variable', function () {
    var source =
    "angular.module('test', [])" +
    ".provider('testProvider', function () {" +
    " var service = {" +
    "   $get: function ($rootScope) {}" +
    " };" +
    " return service;" +
    "});";

    var units = parse(source);

    assert.deepEqual(units, [{
      type: 'provider',
      name: 'testProvider',
      module: { name: 'test' },
      deps: [{ name: '$rootScope' }]
    }]);
  });

  it('should extract provider deps from return fn variable', function () {
    var source =
    "angular.module('test', [])" +
    ".provider('testProvider', function () {" +
    " var foo = function ($rootScope) {};" +
    " return {" +
    "   $get: foo" +
    " };" +
    "});";

    var units = parse(source);

    assert.deepEqual(units, [{
      type: 'provider',
      name: 'testProvider',
      module: { name: 'test' },
      deps: [{ name: '$rootScope' }]
    }]);
  });

  it('should extract provider deps from return variable', function () {
    var source =
    "angular.module('test', [])" +
    ".provider('testProvider', function () {" +
    " var foo = function ($rootScope) {};" +
    " var service = {" +
    "   $get: foo" +
    " };" +
    " return service;" +
    "});";

    var units = parse(source);

    assert.deepEqual(units, [{
      type: 'provider',
      name: 'testProvider',
      module: { name: 'test' },
      deps: [{ name: '$rootScope' }]
    }]);
  });

  it('should extract deps for inline component and inline controller',
     function () {
    var source =
    "angular" +
    " .module('test', [])" +
    " .component('TestComponent', {" +
    "   controller: function ($scope) {}" +
    " });";

    var units = parse(source);

    assert.deepEqual(units, [{
      type: 'component',
      name: 'TestComponent',
      module: { name: 'test' },
      deps: [{ name: '$scope' }]
    }]);
  });

  it('should extract deps for inline component and controller as fn declaration',
     function () {
    var source =
    "angular" +
    " .module('test', [])" +
    " .component('TestComponent', {" +
    "   controller: TestController" +
    " });" +
    "function TestController($scope) {}";

    var units = parse(source);

    assert.deepEqual(units, [{
      type: 'component',
      name: 'TestComponent',
      module: { name: 'test' },
      deps: [{ name: '$scope' }]
    }]);
  });

  it('should extract deps for inline component and controller as fn expression',
     function () {
    var source =
    "angular" +
    " .module('test', [])" +
    " .component('TestComponent', {" +
    "   controller: TestController" +
    " });" +
    "var TestController = function ($scope) {};";

    var units = parse(source);

    assert.deepEqual(units, [{
      type: 'component',
      name: 'TestComponent',
      module: { name: 'test' },
      deps: [{ name: '$scope' }]
    }]);
  });

  it('should extract deps for component as variable and inline controller',
     function () {
    var source =
    "var TestComponent = {" +
    " controller: function ($scope) {}" +
    "};" +
    "angular.module('test', []).component('TestComponent', TestComponent);";

    var units = parse(source);

    assert.deepEqual(units, [{
      type: 'component',
      name: 'TestComponent',
      module: { name: 'test' },
      deps: [{ name: '$scope' }]
    }]);
  });

  it('should extract deps for component as variable and controller as fn',
     function () {
    var source =
    "var TestController = function ($scope) {};" +
    "var TestComponent = {" +
    " controller: TestController" +
    "};" +
    "angular.module('test', []) .component('TestComponent', TestComponent);";
  });

});