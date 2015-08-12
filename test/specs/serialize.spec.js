'use strict';

var assert = require('chai').assert;

var serialize = require('./../../src/serialize');

describe('serialize', function () {

  var unit, data;

  beforeEach(function () {
    unit = {
      name: 'TestService',
      module: {
        name: 'test'
      },
      deps: [
        { name: '$http', type: 'provider' },
        { name: 'TestFactory', type: 'factory' }
      ]
    };
    data = serialize(unit);
  });

  it('should create shortcut for unit name', function () {
    assert.equal(data.name, 'TestService');
  });

  it('should create shortcut for unit name wrapped in _', function () {
    assert.equal(data._name_, '_TestService_');
  });

  it('should create shortcut for module name', function () {
    assert.equal(data.module, 'test');
  });

  it('should create shortcut for deps with names wrapped in _', function () {
    // remove property because can't test it with chai
    // it can't compare functions and does not support jasmine.any
    var removeProp = ['provider'];
    var deps = data.deps.forEach(function (dep) {
      removeProp.forEach(function (prop) {
        delete dep[prop];
      });
    });

    assert.deepEqual(data.deps, [
      {
        name: '$http',
        _name_: '_$http_',
        type: 'provider'
      },
      {
        name: 'TestFactory',
        _name_: '_TestFactory_',
        type: 'factory'
      }
    ]);
  });

  it('should create a helper function to extract dep type', function () {
    assert.equal(data.deps[0].provider(), 'provider');
    assert.equal(data.deps[1].provider(), 'factory');
  });

  it('should create args for deps names', function () {
    assert.deepEqual(data.arg.deps, ['$http', 'TestFactory']);
  });

  it('should create args for deps names wrapped in _', function () {
    assert.deepEqual(data.arg._deps_, ['_$http_', '_TestFactory_']);
  });

});