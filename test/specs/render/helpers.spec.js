'use strict';

var assert = require('chai').assert;

var render = require('./../../../src/render');

describe('render/helpers', function () {

  describe('and', function () {

    it('should join array and prepend comma', function () {
      var data = { arr: [1, 2, 3] };
      var result = render('{{and arr}}', data);
      assert.equal(result, ', 1, 2, 3');
    });

    it('should display nothing for empty array', function () {
      var data = { arr: [] };
      var result = render('{{and arr}}', data);
      assert.equal(result, '');
    });

    it('should display nothing for falsy array', function () {
      var result = render('{{and arr}}');
      assert.equal(result, '');
    });

  });

  describe('only', function () {

    it('should join array', function () {
      var data = { arr: [1, 2, 3] };
      var result = render('{{only arr}}', data);
      assert.equal(result, '1, 2, 3');
    });

    it('should display nothing for empty array', function () {
      var data = { arr: [] };
      var result = render('{{only arr}}', data);
      assert.equal(result, '');
    });

    it('should display nothing for falsy array', function () {
      var result = render('{{only arr}}');
      assert.equal(result, '');
    });

  });

  describe('dashCase', function () {

    it('should dashCase a camelCase', function () {
      var data = { name: 'myDir' };
      var result = render('{{dashCase name}}', data);
      assert.equal(result, 'my-dir');
    });

    it('should dashCase an UpperCamelCase', function () {
      var data = { name: 'MyDir' };
      var result = render('{{dashCase name}}', data);
      assert.equal(result, 'my-dir');
    });

  });

  describe('defaults', function () {

    it('should display truthy value', function () {
      var data = { value: 10 };
      var result = render('{{defaults value 20}}', data);
      assert.equal(result, '10');
    });

    it('should display falsy value', function () {
      var data = { value: 0 };
      var result = render('{{defaults value 20}}', data);
      assert.equal(result, '0');
    });

    it('should fallback to default for undefined value', function () {
      var result = render('{{defaults value 20}}');
      assert.equal(result, '20');
    });

  });

});