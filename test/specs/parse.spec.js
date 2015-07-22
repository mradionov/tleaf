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

});