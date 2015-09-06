'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire');

var cache;
var fsStub = {};

////////

describe('cache', function () {

  beforeEach(function () {
    fsStub = {};
    cache = proxyquire('./../../src/cache', {
      'fs-extra': fsStub
    });
  });

  describe('get', function () {

    it('should return undefined when cache file missing', function () {
      fsStub.readFileSync = function () {
        var error = new Error(); error.code = 'ENOENT'; throw error;
      };
      var value = cache.get('foo');
      assert.isUndefined(value);
    });

    it('should return undefined when no key in file', function () {
      fsStub.readFileSync = function () { return '{}'; };
      var value = cache.get('foo');
      assert.isUndefined(value);
    });

    it('should return undefined when cache file is broken', function () {
      fsStub.readFileSync = function () { return 'badjson'; };
      var value = cache.get('foo');
      assert.isUndefined(value);
    });

    it('should return default value if provided', function () {
      fsStub.readFileSync = function () { return 'badjson'; };
      var value = cache.get('foo', 'bar');
      assert.equal(value, 'bar');
    });

    it('should return value from cache', function () {
      fsStub.readFileSync = function () { return '{"foo":10}'; };
      var value = cache.get('foo');
      assert.equal(value, 10);
    });

    it('should return falsy value from cache', function () {
      fsStub.readFileSync = function () { return '{"foo":0}'; };
      var value = cache.get('foo');
      assert.equal(value, 0);
    });

    it('should return default for undefined value', function () {
      fsStub.readFileSync = function () { return '{"foo":undefined}'; };
      var value = cache.get('foo', 'bar');
      assert.equal(value, 'bar');
    });

    it('should store in memory call to a file', function () {
      fsStub.readFileSync = function () { return '{"foo":10}'; };
      var value = cache.get('foo');
      assert.equal(value, 10);
      fsStub.readFileSync = function () { return 'badjson'; };
      value = cache.get('foo');
      assert.equal(value, 10);
    });

    it('should rethrow any error other that missing file', function () {
      fsStub.readFileSync = function () {
        var error = new Error(); error.code = 'SOMERR'; throw error;
      };
      var fn = function () {
        cache.get('foo');
      };
      assert.throw(fn);
    });

  });

  describe('set', function () {

    it('should write value to new file', function () {
      fsStub.writeFileSync = function (path, data) {
        assert.equal(data, '{"foo":10}');
      };
      cache.set('foo', 10);
    });

    it('should write value to existing file', function () {
      fsStub.readFileSync = function () { return '{"bar":15}'; };
      fsStub.writeFileSync = function (path, data) {
        assert.equal(data, '{"bar":15,"foo":10}');
      };
      cache.set('foo', 10);
    });

    it('should write value to new file with bad existing file', function () {
      fsStub.readFileSync = function () { return 'badjson'; };
      fsStub.writeFileSync = function (path, data) {
        assert.equal(data, '{"foo":10}');
      };
      cache.set('foo', 10);
    });

    it('should override value in existing file', function () {
      fsStub.readFileSync = function () { return '{"foo":15}'; };
      fsStub.writeFileSync = function (path, data) {
        assert.equal(data, '{"foo":10}');
      };
      cache.set('foo', 10);
    });

    it('should override deep value in existing file', function () {
      fsStub.readFileSync = function () { return '{"foo":{"bar":{"baz":15}}}'; };
      fsStub.writeFileSync = function (path, data) {
        assert.equal(data, '{"foo":{"bar":{"baz":10}}}');
      };
      cache.set('foo.bar.baz', 10);
    });

  });

  describe('remove', function () {

    it('should remove top property', function () {
      fsStub.readFileSync = function () { return '{"foo":10}'; };
      fsStub.writeFileSync = function (path, data) {
        assert.equal(data, '{}');
      };
      cache.remove('foo');
    });

    it('should remove deep property', function () {
      fsStub.readFileSync = function () { return '{"foo":{"bar":{"baz":15}}}'; };
      fsStub.writeFileSync = function (path, data) {
        assert.equal(data, '{"foo":{"bar":{}}}');
      };
      cache.remove('foo.bar.baz');
    });

  });

});