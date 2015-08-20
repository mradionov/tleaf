'use strict';

var assert = require('chai').assert;
var _ = require('lodash');
var proxyquire = require('proxyquire');

var inquirerStub = {};

var ask = proxyquire('../../src/ask', {
  'inquirer': inquirerStub
});

describe('ask', function () {

  describe.only('createUnit', function () {

    it('should throw an error when there is no units to process', function () {
      ask.createUnit({ providers: ['factory'] }, function (err) {
        assert.ok(err instanceof Error);
      });
    });

    it('should throw an error when there is no providers to process', function () {
      ask.createUnit({ units: ['factory'] }, function (err) {
        assert.ok(err instanceof Error);
      });
    });

    it('should pass units option to type question', function () {
      inquirerStub.prompt = function (questions) {
        var typeQuestion = _.findWhere(questions, { name: 'type' });
        assert.deepEqual(typeQuestion.choices, ['service', 'directive']);
      };
      ask.createUnit({ units: ['service', 'directive'] });
    });

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
      ask.createUnit({
        units: ['controller'], providers: ['factory']
      }, function (err, unit) {
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
        inquirerStub.prompt = function (questions, repsond) {
          inquirerStub.prompt = function (questions, respond) {
            inquirerStub.prompt = function (questions, respond) {
              respond({ name: '' });
            };
            respond({ type: 'factory' });
          };
          respond({ name: 'MyFactory' });
        };
        respond({
          name: 'TestCtrl',
          type: 'controller',
          module: 'test'
        });
      };
      ask.createUnit({
        units: ['controller'], providers: ['factory']
      }, function (err, unit) {
        assert.deepEqual(unit, {
          name: 'TestCtrl',
          type: 'controller',
          module: { name: 'test' },
          deps: [
            { name: 'MyFactory', type: 'factory' }
          ]
        });
      });
    });

  });


});