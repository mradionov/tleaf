'use strict';

var assert = require('chai').assert;

var parse = require('./../../../src/parse');

describe('parse/module', function () {

  it('should extract module from a variable', function () {
    var source =
    "var mod = angular.module('test', []);" +
    "mod.controller('TestController', function ($scope) {});";

    var units = parse(source);

    assert.deepEqual(units, [{
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

    assert.deepEqual(units, [{
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

    assert.deepEqual(units, [{
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

    assert.deepEqual(units, [{
      type: 'controller',
      name: 'TestController',
      module: { name: 'test' },
      deps: [{ name: '$scope' }]
    }]);
  });

});