'use strict';

var assert = require('chai').assert;
var _ = require('lodash');
var proxyquire = require('proxyquire');

var inquirerStub = {};

var ask = proxyquire('../../src/ask', {
  'inquirer': inquirerStub
});

describe('ask', function () {

  describe('createUnit', function () {

    it('should create unit without dependencies', function () {
      inquirerStub.prompt = function (questions, respond) {
        inquirerStub.prompt = function (questions, respond) {
          respond({ name: '' });
        };
        respond({
          name: 'TestCtrl',
          type: 'controller',
          module: 'test'
        });
      };
      ask.createUnit({}, function (err, unit) {
        assert.deepEqual(unit, {
          name: 'TestCtrl',
          type: 'controller',
          module: { name: 'test' },
          deps: []
        });
      });
    });

    it('should create unit with dependencies', function () {
      inquirerStub.prompt = function (questions, respond) {
        inquirerStub.prompt = function (questions, respond) {
          inquirerStub.prompt = function (questions, respond) {
            respond({ name: '' });
          };
          respond({
            name: 'TestFactory',
            type: 'factory'
          });
        };
        respond({
          name: 'TestCtrl',
          type: 'controller',
          module: 'test'
        });
      };
      ask.createUnit({}, function (err, unit) {
        assert.deepEqual(unit, {
          name: 'TestCtrl',
          type: 'controller',
          module: { name: 'test' },
          deps: [
            { name: 'TestFactory', type: 'factory' }
          ]
        });
      });

    });

  });

  describe('pickUnit', function () {

    it('should pick a unit', function () {
      inquirerStub.prompt = function (question, respond) {
        respond({ unit: 1 });
      };
      ask.pickUnit([
        { name: 'TestFactory', type: 'factory', module: { name: 'test' } },
        { name: 'TestService', type: 'service', module: { name: 'test' } },
        { name: 'TestProvider', type: 'provider', module: { name: 'test' } }
      ], function (err, unit) {
        assert.deepEqual(unit, {
          name: 'TestService', type: 'service', module: { name: 'test' }
        });
      });
    });

  });

  describe('identifyDeps', function () {

    it('should identify deps', function () {
      inquirerStub.prompt = function (question, respond) {
        respond({ '0': 'factory', '1': 'service', '2': 'provider' });
      };
      ask.identifyDeps([
        { name: 'TestFactory' },
        { name: 'TestService' },
        { name: 'TestProvider' }
      ], {}, function (err, deps) {
        assert.deepEqual(deps, [
          { name: 'TestFactory', type: 'factory' },
          { name: 'TestService', type: 'service' },
          { name: 'TestProvider', type: 'provider' }
        ]);
      });
    });

  });

});