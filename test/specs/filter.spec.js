'use strict';

var assert = require('chai').assert;

var filter = require('./../../src/filter');

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
  });

  it('should move all deps to unknown', function () {
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
    var result = filter(unit.deps, { exclude: ['$scope', 'MyDir'] });
    assert.deepEqual(result, {
      known: [],
      unknown: [
        { name: 'MyCtrl', type: 'controller' }
      ]
    });
  });

});