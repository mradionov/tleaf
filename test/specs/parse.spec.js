'use strict';

// TODO: split specs

var assert = require('chai').assert;

var parse = require('./../../src/parse');

describe('parse', function () {

  it('should extract controller', function () {
    var source =
    "angular" +
    " .module('test', [])" +
    " .controller('TestController', function ($scope) {});";

    var units = parse(source);

    assert.lengthOf(units, 1);
    assert.sameDeepMembers(units, [{
      type: 'controller',
      name: 'TestController',
      module: { name: 'test' },
      deps: [{ name: '$scope' }]
    }]);
  });

  it('should extract controller from IIFE', function () {
    var source =
    "(function () {" +
    " angular" +
    "   .module('test', [])" +
    "   .controller('TestController', function ($scope) {});" +
    "}())";

    var units = parse(source);

    assert.lengthOf(units, 1);
    assert.sameDeepMembers(units, [{
      type: 'controller',
      name: 'TestController',
      module: { name: 'test' },
      deps: [{ name: '$scope' }]
    }]);
  });

  it('should extract module from a variable', function () {
    var source =
    "var mod = angular.module('test', []);" +
    "mod.controller('TestController', function ($scope) {});";

    var units = parse(source);

    assert.lengthOf(units, 1);
    assert.sameDeepMembers(units, [{
      type: 'controller',
      name: 'TestController',
      module: { name: 'test' },
      deps: [{ name: '$scope' }]
    }]);
  });

  it('should extract all implicit injections', function () {
    var source =
    "angular.module('test', []).controller('TestController', function (" +
    "   $scope, $rootScope, UserService, API_URL, moment) {});";

    var units = parse(source);

    assert.lengthOf(units, 1);
    assert.sameDeepMembers(units, [{
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

    assert.lengthOf(units, 1);
    assert.sameDeepMembers(units, [{
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

  it('should extract multiple controllers for one module', function () {
    var source =
    "angular.module('test', [])" +
    ".controller('Test1Controller', function () {})" +
    ".controller('Test2Controller', function () {})" +
    ".controller('Test3Controller', function () {})";

    var units = parse(source);

    assert.lengthOf(units, 3);
    assert.sameDeepMembers(units, [{
      type: 'controller',
      name: 'Test1Controller',
      module: { name: 'test' },
      deps: []
    }, {
      type: 'controller',
      name: 'Test2Controller',
      module: { name: 'test' },
      deps: []
    }, {
      type: 'controller',
      name: 'Test3Controller',
      module: { name: 'test' },
      deps: []
    }]);
  });

  it('should extract controller from a function declaration', function () {
    var source =
    "angular.module('test', []).controller('TestController', TestController);" +
    "function TestController($scope) {}";

    var units = parse(source);

    assert.lengthOf(units, 1);
    assert.sameDeepMembers(units, [{
      type: 'controller',
      name: 'TestController',
      module: { name: 'test' },
      deps: [{ name: '$scope' }]
    }]);
  });

  it('should extract controller from a function expression', function () {
    var source =
    "angular.module('test', []).controller('TestController', TestController);" +
    "var TestController = function ($scope) {};"

    var units = parse(source);

    assert.lengthOf(units, 1);
    assert.sameDeepMembers(units, [{
      type: 'controller',
      name: 'TestController',
      module: { name: 'test' },
      deps: [{ name: '$scope' }]
    }]);
  });

  it('should extract correct module name when multiple present', function () {
    var source =
    "var modA = angular.module('testA', []);" +
    "var modB = angular.module('testB', []);" +
    "var modC = angular.module('testC', []);" +
    "modB.controller('TestController', function ($scope) {});";

    var units = parse(source);

    assert.lengthOf(units, 1);
    assert.sameDeepMembers(units, [{
      type: 'controller',
      name: 'TestController',
      module: { name: 'testB' },
      deps: [{ name: '$scope' }]
    }]);
  });

  it('should extract module from same scope', function () {
    var source =
    "var mod = angular.module('bad-test', []);" +
    "(function () {" +
    "   var mod = angular.module('test', []);" +
    "   mod.controller('TestController', function ($scope) {" +
    "     var mod = 15;" +
    "   });" +
    "}())";

    var units = parse(source);

    assert.lengthOf(units, 1);
    assert.sameDeepMembers(units, [{
      type: 'controller',
      name: 'TestController',
      module: { name: 'test' },
      deps: [{ name: '$scope' }]
    }]);
  });

  it('should extract module from parent scope', function () {
    var source =
    "var mod = angular.module('test', []);" +
    "(function () {" +
    "   mod.controller('TestController', function ($scope) {});" +
    "}())";

    var units = parse(source);

    assert.lengthOf(units, 1);
    assert.sameDeepMembers(units, [{
      type: 'controller',
      name: 'TestController',
      module: { name: 'test' },
      deps: [{ name: '$scope' }]
    }]);
  });

  it('should extract controller from a parent scope', function () {
    var source =
    "function TestController($scope) {}" +
    "(function () {" +
    "angular.module('test', []).controller('TestController', TestController);" +
    "}());";

    var units = parse(source);

    assert.lengthOf(units, 1);
    assert.sameDeepMembers(units, [{
      type: 'controller',
      name: 'TestController',
      module: { name: 'test' },
      deps: [{ name: '$scope' }]
    }]);
  });

  it('should extract a service', function () {
    var source =
    "angular.module('test', [])" +
    ".service('TestService', function ($http) {});";

    var units = parse(source);

    assert.deepEqual(units, [{
      type: 'service',
      name: 'TestService',
      module: { name: 'test' },
      deps: [{ name: '$http' }]
    }]);
  });

  it('should extract directive', function () {
    var source =
    "angular.module('test', [])" +
    ".directive('TestDirective', function ($interval) {});";

    var units = parse(source);

    assert.deepEqual(units, [{
      type: 'directive',
      name: 'TestDirective',
      module: { name: 'test' },
      deps: [{ name: '$interval' }]
    }]);
  });

  it('should extract filter', function () {
    var source =
    "angular.module('test', [])" +
    ".filter('testFilter', function () {});";

    var units = parse(source);

    assert.deepEqual(units, [{
      type: 'filter',
      name: 'testFilter',
      module: { name: 'test' },
      deps: []
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

  it.only('should extract provider deps from this variable', function () {
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

});