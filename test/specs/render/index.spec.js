'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire');
var _ = require('lodash');

var configStub = {
  '@noCallThru': true
};

var render = proxyquire('./../../../src/render', {
  '../config': configStub
});

////////

describe('render/index', function () {

  beforeEach(function () {
    _.extend(configStub, {
      template: {},
      units: {},
      dependencies: {}
    });
  });

  describe('indent', function () {

    it('should keep tabs indent', function () {
      var source = '		'; // tabs here
      configStub.template.indent = '\t';
      var result = render(source);
      assert.equal(result, '		'); // tabs here
    });

    it('should replace tabs with string', function () {
      var source = '		'; // tabs here
      configStub.template.indent = 4;
      var result = render(source);
      assert.equal(result, '        '); // spaces here
    });

    it('should replace tabs with string', function () {
      var source = '		'; // tabs here
      configStub.template.indent = '--';
      var result = render(source);
      assert.equal(result, '----');
    });

  });

});