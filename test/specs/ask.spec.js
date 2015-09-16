'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var _ = require('lodash');
var proxyquire = require('proxyquire');

var inquirerStub = {};
var configStub = {
  '@noCallThru': true
};

var ask = proxyquire('../../src/ask', {
  'inquirer': inquirerStub,
  './config': configStub
});

////////

describe('ask', function () {

  beforeEach(function () {
    _.extend(configStub, {
      template: {},
      units: {},
      dependencies: {
        process: ['factory', 'service', 'provider', 'value', 'constant']
      }
    });
  });

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
      ask.createUnit(function (unit) {
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
      ask.createUnit(function (unit) {
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

    it('should list processed units from config', function () {
      inquirerStub.prompt = sinon.spy();
      configStub.units.process = ['foo', 'bar', 'baz'];
      ask.createUnit(_.noop);
      var questions = inquirerStub.prompt.getCall(0).args[0];
      var question = _.findWhere(questions, { name: 'type' });
      assert.deepEqual(question.choices, ['foo', 'bar', 'baz']);
    });

    it('should list processed dependencies from config', function () {
      inquirerStub.prompt = function (questions, respond) {
        inquirerStub.prompt = sinon.spy();
        respond({
          name: 'TestCtrl',
          type: 'controller',
          module: 'test'
        });
      };
      configStub.dependencies.process = ['foo', 'bar', 'baz'];
      ask.createUnit(_.noop);
      var questions = inquirerStub.prompt.getCall(0).args[0];
      var question = _.findWhere(questions, { name: 'type' });
      assert.deepEqual(question.choices, ['foo', 'bar', 'baz']);
    });

    it('should not even ask if config option empty', function () {
      inquirerStub.prompt = function (questions, respond) {
        inquirerStub.prompt = sinon.spy();
        respond({
          name: 'TestCtrl',
          type: 'controller',
          module: 'test'
        });
      };
      configStub.dependencies.process = [];
      ask.createUnit(function (unit) {
        assert.deepEqual(unit.deps, []);
      });
      assert.notOk(inquirerStub.prompt.called);
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
      ], function (unit) {
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
      ], function (deps) {
        assert.deepEqual(deps, [
          { name: 'TestFactory', type: 'factory' },
          { name: 'TestService', type: 'service' },
          { name: 'TestProvider', type: 'provider' }
        ]);
      });
    });

    it('should list processed dependencies from config', function () {
      inquirerStub.prompt = sinon.spy();
      configStub.dependencies.process = ['foo', 'bar', 'baz'];
      ask.identifyDeps([
        { name: 'TestFactory' },
        { name: 'TestService' },
        { name: 'TestProvider' }
      ], _.noop);
      var questions = inquirerStub.prompt.getCall(0).args[0];
      var question = questions[0];
      assert.deepEqual(question.choices, ['foo', 'bar', 'baz']);
    });

    it('should not even ask if config option empty', function () {
      inquirerStub.prompt = sinon.spy();
      configStub.dependencies.process = [];
      ask.identifyDeps([
        { name: 'TestFactory' },
        { name: 'TestService' },
        { name: 'TestProvider' }
      ], function (identified) {
        assert.deepEqual(identified, []);
      });
      assert.notOk(inquirerStub.prompt.called);
    });

  });

});