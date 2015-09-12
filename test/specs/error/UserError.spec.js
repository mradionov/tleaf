'use strict';

var assert = require('chai').assert;

var UserError = require('./../../../src/error/UserError');

describe('error/UserError', function () {

  it('should have a respective name', function () {
    var err = new UserError();
    assert.equal(err.name, 'UserError');
  });

  it('should store custom message', function () {
    var err = new UserError('foo bar');
    assert.equal(err.userMessage, 'foo bar');
  });

  it('should have undefined custom message if missing', function () {
    var err = new UserError();
    assert.isUndefined(err.userMessage);
  });

  it('should have original error message', function () {
    var originalErr = new Error('baz qux');
    var err = new UserError('foo bar', originalErr);
    assert.equal(err.message, 'baz qux');
  });

  it('should have original error stack', function () {
    var originalErr = new Error('baz qux');
    var err = new UserError('foo bar', originalErr);
    assert.equal(err.stack, originalErr.stack);
  });

  it('should have undefined message if original error missing', function () {
    var err = new UserError();
    assert.isUndefined(err.message);
  });

  it('should have undefined stack if original error missing', function () {
    var err = new UserError();
    assert.isUndefined(err.stack);
  });

  it('should use user error message if original error missing', function () {
    var err = new UserError('foo bar');
    assert.equal(err.message, 'foo bar');
  });

});