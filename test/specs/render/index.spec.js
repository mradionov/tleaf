'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire');

var stub = { config: {} };

var render = proxyquire('../../../src/render', {
  '../config': stub.config
});

describe('render/index', function () {

  describe('indent', function () {

    it('should keep tabs indent', function () {
      var source = '		'; // tabs here
      stub.config.indent = '\t';
      var result = render(source);
      assert.equal(result, '		'); // tabs here
    });

    it('should replace tabs with string', function () {
      var source = '		'; // tabs here
      stub.config.indent = 4;
      var result = render(source);
      assert.equal(result, '        '); // spaces here
    });

    it('should replace tabs with string', function () {
      var source = '		'; // tabs here
      stub.config.indent = '--';
      var result = render(source);
      assert.equal(result, '----');
    });

  });

});