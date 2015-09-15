'use strict';

var assert = require('chai').assert;
var _ = require('lodash');
var proxyquire = require('proxyquire');

var fsStub = {};
var cacheStub = {};
var configStub = {
  '@noCallThru': true
};

var template = proxyquire('./../../src/template', {
  'fs-extra': fsStub,
  './cache': cacheStub,
  './config': configStub
});

describe('template', function () {

  beforeEach(function () {
    _.extend(configStub, {
      template: {},
      units: {},
      dependencies: { templateMap: {} }
    });
  });

  describe('when there is no cached config', function () {

    beforeEach(function () {
      cacheStub.get = function () { return; }
    });

    it('should use default path for unit template', function () {
      fsStub.readFileSync = function (path) {
        assert.equal(path, 'src/defaults/templates/controller.tpl.js');
      };
      template.unit('controller');
    });

    it('should use default path for dependency template', function () {
      fsStub.readFileSync = function (path) {
        assert.equal(path, 'src/defaults/templates/dependencies/service.tpl.js');
      };
      template.dependency('service');
    });

  });

  describe('when there is cached config', function () {

    beforeEach(function () {
      cacheStub.get = function () { return '/cache/config.js'; }
    });

    describe('and template exists', function () {

      beforeEach(function () {
        fsStub.existsSync = function () { return true; }
      });

      it('should use cached path for unit template', function () {
        fsStub.readFileSync = function (path) {
          assert.equal(path, '/cache/templates/controller.tpl.js');
        };
        template.unit('controller');
      });

      it('should use cached path for dependency template', function () {
        fsStub.readFileSync = function (path) {
          assert.equal(path, '/cache/templates/dependencies/service.tpl.js');
        };
        template.dependency('service');
      });

    });

    describe('and template does not exist', function () {

      beforeEach(function () {
        fsStub.existsSync = function () { return false; }
      });

      it('should use default path for unit template', function () {
        fsStub.readFileSync = function (path) {
          assert.equal(path, 'src/defaults/templates/controller.tpl.js');
        };
        template.unit('controller');
      });

      it('should use default path for dependency template', function () {
        fsStub.readFileSync = function (path) {
          assert.equal(path, 'src/defaults/templates/dependencies/service.tpl.js');
        };
        template.dependency('service');
      });

    });

  });

  describe('dependency', function () {

    it('should use mapped template', function () {
      configStub.dependencies.templateMap = {
        'factory': 'service'
      };
      fsStub.readFileSync = function (path) {
        assert.equal(path, 'src/defaults/templates/dependencies/service.tpl.js');
      };
      template.dependency('factory');
    });

  });

  it('should throw when template file is missing', function () {
    fsStub.readFileSync = function () {
      throw { code: 'ENOENT' };
    };
    var fn = function () {
      template.unit('controller');
    };
    assert.throw(fn);
  });

  it('should throw when template file is not readable', function () {
    fsStub.readFileSync = function () {
      throw { code: 'EACCES' };
    };
    var fn = function () {
      template.unit('controller');
    };
    assert.throw(fn);
  });

});