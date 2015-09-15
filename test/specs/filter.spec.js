'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire');
var _ = require('lodash');

var configStub = {
  '@noCallThru': true
};

var filter = proxyquire('./../../src/filter', {
  './config': configStub
});

////////

describe('filter', function () {

  var unit;

  beforeEach(function () {
    unit = {
      deps: [
        { name: '$scope', type: 'provider' },
        { name: 'MyCtrl', type: 'controller' },
        { name: 'MyDir', type: 'directive' }
      ]
    };
    _.extend(configStub, {
      template: {},
      units: {},
      dependencies: {}
    });
  });

  it('should move all deps to unknown', function () {
    configStub.dependencies.filter = [];
    var result = filter(unit.deps);
    assert.deepEqual(result, {
      known: [],
      unknown: [
        { name: '$scope', type: 'provider' },
        { name: 'MyCtrl', type: 'controller' },
        { name: 'MyDir', type: 'directive' }
      ]
    });
  });

  it('should exclude deps if set', function () {
    configStub.dependencies.filter = ['$scope', 'MyDir'];
    var result = filter(unit.deps);
    assert.deepEqual(result, {
      known: [],
      unknown: [
        { name: 'MyCtrl', type: 'controller' }
      ]
    });
  });

});