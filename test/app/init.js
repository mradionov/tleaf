'use strict';

var fs = require('fs-extra');
var path = require('path');
var _ = require('lodash');
var proxyquire = require('proxyquire').noCallThru();

var askStub = {};
var run = proxyquire('../../src/run', {
  './ask': askStub
});

var sourcePath = path.join('test', 'app', 'source', 'app.js');
var outputBasePath = path.join('test', 'app', 'output');


////////

generate('controller', 'MyCtrl', { '$http': 'provider', 'MyService': 'service' });
generate('service', 'MyService', { '$http': 'provider', 'MyService': 'service' });
generate('factory', 'MyFactory', { '$http': 'provider', 'MyService': 'service' });
generate('directive', 'myDir', { '$http': 'provider', 'MyService': 'service' });
generate('provider', 'MyProvider', { '$http': 'provider', 'MyService': 'service' });
generate('filter', 'MyFilter');
generate('value', 'MyValue');
generate('constant', 'MyConstant');

////////

// stub ask module with predefined answers to be able to select desired unit
function generate(type, name, deps) {

  askStub.pickUnit = function (units, callback) {
    var unit = _.find(units, function (unit) {
      return unit.type === type && unit.name === name;
    });
    if (_.isUndefined(unit)) {
      throw new Error('Unit to found');
    }
    callback(unit);
  };

  askStub.identifyDeps = function (unknown, callback) {
    var identified = _.map(unknown, function (dep) {
      if (_.isUndefined(deps[dep.name])) {
        throw new Error('Dep not found');
      }
      dep.type = deps[dep.name];
      return dep;
    });
    callback(identified);
  };

  var outputPath = path.join(outputBasePath, type + '.spec.js');

  run.parse(sourcePath, outputPath);

  var targetString = '// Specs here';
  var replaceString =
    'it("should work", function () {' +
    ' expect(true).to.be.ok; ' +
    '});';

  var output = fs.readFileSync(outputPath, 'utf8');
  var outputWithSpec = output.replace(targetString, replaceString);

  fs.writeFileSync(outputPath, outputWithSpec, 'utf8');
}