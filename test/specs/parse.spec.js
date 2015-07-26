'use strict';

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
      module: 'test',
      deps: ['$scope']
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
      module: 'test',
      deps: ['$scope']
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
      module: 'test',
      deps: ['$scope']
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
      module: 'test',
      deps: ['$scope', '$rootScope', 'UserService', 'API_URL', 'moment']
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
      module: 'test',
      deps: ['$scope', '$rootScope', 'UserService', 'API_URL', 'moment']
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
      module: 'test',
      deps: []
    }, {
      type: 'controller',
      name: 'Test2Controller',
      module: 'test',
      deps: []
    }, {
      type: 'controller',
      name: 'Test3Controller',
      module: 'test',
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
      module: 'test',
      deps: ['$scope']
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
      module: 'test',
      deps: ['$scope']
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
      module: 'testB',
      deps: ['$scope']
    }]);
  });

});