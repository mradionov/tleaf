'use strict';

var assert = require('chai').assert;

var serialize = require('./../../src/serialize');

describe('serialize', function () {

  var unit;

  beforeEach(function () {
    unit = {
      name: 'TestService',
      module: {
        name: 'test'
      },
      deps: [
        { name: '$http' },
        { name: 'TestFactory' }
      ]
    };
  });

  it('should create shortcut for unit name', function () {
    var data = serialize(unit);
    assert.equal(data.name, 'TestService');
  });

  it('should create shortcut for module name', function () {
    var data = serialize(unit);
    assert.equal(data.module, 'test');
  });

  it('should create shortcut for deps names', function () {
    var data = serialize(unit);
    assert.deepEqual(data.deps, ['$http', 'TestFactory']);
  });

  it('should create shortcut for deps names underscore wrapped', function () {
    var data = serialize(unit);
    assert.deepEqual(data._deps_, ['_$http_', '_TestFactory_']);
  });

});