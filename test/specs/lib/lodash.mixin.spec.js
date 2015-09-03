'use strict';

var assert = require('chai').assert;

var _ = require('./../../../src/lib/lodash.mixin');

describe('lodash.mixin', function () {

  describe('sortByKeys', function () {

    var objects = [
      { name: 'foo', title: 'Foo', category: { name: 'foo cat' }},
      { name: 'bar', title: 'Bar', category: { name: 'bar cat' }},
      { name: 'baz', title: 'Baz', category: { name: 'baz cat' }}
    ];

    it('should return original value if not array', function () {
      var result = _.sortByKeys('foo');
      assert.equal(result, 'foo');
    });

    it('should return original array of keys not passed', function () {
      var result = _.sortByKeys(objects);
      assert.deepEqual(result, objects);
    });

    it('should return original array if path not passed', function () {
      var result = _.sortByKeys(objects, ['bar', 'foo']);
      assert.deepEqual(result, objects);
    });

    it('should sort by keys', function () {
      var result = _.sortByKeys(objects, ['baz', 'foo', 'bar'], 'name');
      assert.deepEqual(result, [
        { name: 'baz', title: 'Baz', category: { name: 'baz cat' }},
        { name: 'foo', title: 'Foo', category: { name: 'foo cat' }},
        { name: 'bar', title: 'Bar', category: { name: 'bar cat' }}
      ]);
    });

    it('should sort by keys deep path', function () {
      var result = _.sortByKeys(
        objects, ['bar cat', 'baz cat', 'foo cat'], 'category.name'
      );
      assert.deepEqual(result, [
        { name: 'bar', title: 'Bar', category: { name: 'bar cat' }},
        { name: 'baz', title: 'Baz', category: { name: 'baz cat' }},
        { name: 'foo', title: 'Foo', category: { name: 'foo cat' }}
      ]);
    });

    it('should not modify original array', function () {
      var result = _.sortByKeys(objects, ['baz', 'foo', 'bar'], 'name');
      assert.deepEqual(objects, [
        { name: 'foo', title: 'Foo', category: { name: 'foo cat' }},
        { name: 'bar', title: 'Bar', category: { name: 'bar cat' }},
        { name: 'baz', title: 'Baz', category: { name: 'baz cat' }}
      ]);
    });

    it('should sort missing keys last', function () {
      var result = _.sortByKeys(objects, ['baz', 'foo'], 'name');
      assert.deepEqual(result, [
        { name: 'baz', title: 'Baz', category: { name: 'baz cat' }},
        { name: 'foo', title: 'Foo', category: { name: 'foo cat' }},
        { name: 'bar', title: 'Bar', category: { name: 'bar cat' }}
      ]);
    });

  });

});