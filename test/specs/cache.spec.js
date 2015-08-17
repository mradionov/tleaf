'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire');

var fsStub = {};

var cache = proxyquire('./../../src/cache', {
  'fs-extra': fsStub
});

describe.only('cache', function () {

  describe('get', function () {

    it('should return undefined when cache file missing', function () {
      fsStub.exists = function (path, cb) { cb(null, false); };
      cache.get('foo').then(function (value) {
        assert.isUndefined(value);
      });
    });

    it('should return undefined when no key in file', function () {
      fsStub.exists = function (path, cb) { cb(null, true); };
      fsStub.readFile = function (path, opt, cb) { cb(null, '{}'); };
      cache.get('foo').then(function (value) {
        assert.isUndefined(value);
      });
    });

    it('should return undefined when cache file is broken', function () {
      fsStub.exists = function (path, cb) { cb(null, true); };
      fsStub.readFile = function (path, opt, cb) { cb(null, 'badjson'); };
      cache.get('foo').then(function (value) {
        assert.isUndefined(value);
      });
    });

    it('should return default value if provided', function () {
      fsStub.exists = function (path, cb) { cb(null, false); };
      cache.get('foo', 'bar').then(function (value) {
        assert.equal(value, 'bar');
      });
    });

    it('should return value from cache', function () {
      fsStub.exists = function (path, cb) { cb(null, true); };
      fsStub.readFile = function (path, opt, cb) { cb(null, '{ "foo": 10 }'); };
      cache.get('foo').then(function (value) {
        assert.equal(value, 10);
      });
    });

    it('should return falsy value from cache', function () {
      fsStub.exists = function (path, cb) { cb(null, true); };
      fsStub.readFile = function (path, opt, cb) { cb(null, '{ "foo": 0 }'); };
      cache.get('foo').then(function (value) {
        assert.equal(value, 0);
      });
    });

    it('should return default for undefined value', function () {
      fsStub.exists = function (path, cb) { cb(null, true); };
      fsStub.readFile = function (path, opt, cb) { cb(null, '{ "foo": undefined }'); };
      cache.get('foo', 'bar').then(function (value) {
        assert.equal(value, 'bar');
      });
    });

    it('should store in memory call to a file', function () {
      fsStub.exists = function (path, cb) { cb(null, true); };
      fsStub.readFile = function (path, opt, cb) { cb(null, '{ "foo": 10 }'); };
      cache.get('foo').then(function (value) {
        assert.equal(value, 10);
      });
      fsStub.exists = function (path, cb) { cb(null, false); };
      cache.get('foo').then(function (value) {
        assert.equal(value, 10);
      });
    });

  });


});