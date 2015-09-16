'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire');

////////

var resolvedConfig;
var cacheStub = {};
var defaultConfigStub = function (config) {
  config.set({
    foo: 'bar',
    baz: {
      qux: [7, 1, 2, 3],
      doo: false
    },
    units: {
      process: ['yo', 'sw']
    }
  });
};
var defaultCachedConfigStub = function (config) {
  config.set({
    foo: 'moo',
    boo: 'bar',
    baz: {
      qux: [4, 5, 9],
      woo: true
    }
  });
};

////////

describe('config/index', function () {

  var cachedConfigStub;

  function load() {
    resolvedConfig = proxyquire('./../../../src/config', {
      '../cache': cacheStub,
      './default': defaultConfigStub,
      '/cache/tleaf.conf.js': cachedConfigStub
    });
  }

  beforeEach(function () {
    cachedConfigStub = defaultCachedConfigStub;
    cachedConfigStub['@noCallThru'] = true;
  });

  it('should use default config when path in cache not set', function () {
    cacheStub.get = function () { return; }
    load();
    assert.deepEqual(resolvedConfig, {
      foo: 'bar',
      baz: {
        qux: [7, 1, 2, 3],
        doo: false
      },
      units: {
        process: ['yo', 'sw']
      }
    });
  });

  it('should use default config when cache does not exist', function () {
    cacheStub.get = function () { return '/cache/tleaf.conf.js'; }
    cachedConfigStub = function () { throw { code: 'MODULE_NOT_FOUND' } };
    load();
    assert.deepEqual(resolvedConfig, {
      foo: 'bar',
      baz: {
        qux: [7, 1, 2, 3],
        doo: false
      },
      units: {
        process: ['yo', 'sw']
      }
    });
  });

  it('should merge in currenly used cached config with default', function () {
    cacheStub.get = function () { return '/cache/tleaf.conf.js'; }
    load();
    assert.deepEqual(resolvedConfig, {
      foo: 'moo',
      boo: 'bar',
      baz: {
        qux: [4, 5, 9],
        doo: false,
        woo: true
      },
      units: {
        process: ['yo', 'sw']
      }
    });
  });

  it('should throw an error if units.process is empty', function () {
    cacheStub.get = function () { return '/cache/tleaf.conf.js'; }
    cachedConfigStub = function (config) {
      config.set({ units: { process: [] } });
    };
    cachedConfigStub['@noCallThru'] = true;
    var fn = function () { load(); };
    assert.throw(fn);
  });

});