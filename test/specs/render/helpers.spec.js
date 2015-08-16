'use strict';

var assert = require('chai').assert;

var helpers = require('./../../../src/render/helpers');

describe('render/helpers', function () {

  describe('and', function () {

    it('should join array elements with leading comma', function () {
      var result = helpers.and(['foo', 'bar', 'baz']);
      assert.equal(result, ', foo, bar, baz');
    });

    it('should return empty string if array is empty', function () {
      var result = helpers.and([]);
      assert.equal(result, '');
    });

  });

  describe('only', function () {

    it('should join array element', function () {
      var result = helpers.only(['foo', 'bar', 'baz']);
      assert.equal(result, 'foo, bar, baz');
    });

    it('should return empty string if array is empty', function () {
      var result = helpers.only([]);
      assert.equal(result, '');
    });

  });

  describe('dashCase', function () {

    it('should convert UpperCamelCase', function () {
      var result = helpers.dashCase('MyDir');
      assert.equal(result, 'my-dir');
    });

    it('should convert camelCase', function () {
      var result = helpers.dashCase('myDir');
      assert.equal(result, 'my-dir');
    });

  });

  describe('defaults', function () {

    it('should return truthy value', function () {
      var result = helpers.defaults('foo', 'bar');
      assert.equal(result, 'foo');
    });

    it('should return falsy value', function () {
      var result = helpers.defaults(false, 'bar');
      assert.equal(result, false);
    });

    it('should fallback to default for undefined value', function () {
      var result = helpers.defaults(undefined, 'bar');
      assert.equal(result, 'bar');
    });

  });

});