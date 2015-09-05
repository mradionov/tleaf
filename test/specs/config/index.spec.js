'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire');

////////

var resolvedConfig;
var cacheStub = {};
var fsStub = {};
var defaultConfigStub = function (config) {
  config.set({
    foo: 'bar',
    baz: {
      qux: [1, 2, 3],
      doo: false
    }
  });
};
var cachedConfigStub = function (config) {
  config.set({
    foo: 'moo',
    boo: 'bar',
    baz: {
      qux: [1, 5, 3],
      woo: true
    }
  });
};
cachedConfigStub['@noCallThru'] = true;

////////

describe('config/index', function () {

  function load() {
    resolvedConfig = proxyquire('./../../../src/config', {
      'fs-extra': fsStub,
      '../cache': cacheStub,
      './default': defaultConfigStub,
      '/cache/tleaf.conf.js': cachedConfigStub
    });
  }

  it('should use default config when path in cache not set', function () {
    cacheStub.get = function () { return; }
    load();
    assert.deepEqual(resolvedConfig, {
      foo: 'bar',
      baz: {
        qux: [1, 2, 3],
        doo: false
      }
    });
  });

  it('should use default config when cache does not exist', function () {
    cacheStub.get = function () { return '/cache/tleaf.conf.js'; }
    fsStub.existsSync = function () { return false; }
    load();
    assert.deepEqual(resolvedConfig, {
      foo: 'bar',
      baz: {
        qux: [1, 2, 3],
        doo: false
      }
    });
  });

  it('should merge in currenly used cached config with default', function () {
    cacheStub.get = function () { return '/cache/tleaf.conf.js'; }
    fsStub.existsSync = function (path) {
      console.log(path);
      return true;
    }
    load();
    assert.deepEqual(resolvedConfig, {
      foo: 'moo',
      boo: 'bar',
      baz: {
        qux: [1, 5, 3],
        doo: false,
        woo: true
      }
    });
  });

});