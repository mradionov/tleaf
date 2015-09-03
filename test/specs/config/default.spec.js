'use strict';

var assert = require('chai').assert;

var defaultConfig = require('./../../../src/config/default');

describe('config/default', function () {

  it('should be exportable node module', function () {
    assert.isObject(defaultConfig);
  });

});