'use strict';

var fs = require('fs-extra');
var path = require('path');
var _ = require('lodash');
var proxyquire = require('proxyquire').noCallThru();

var askStub = {};
var run = proxyquire('../../src/run', {
  './ask': askStub
});

var appSourcePath = path.join('test', 'app', 'source', 'app.js');
var testBasePath = path.join('test', 'app', 'test');


////////

generate('controller', 'MyCtrl', { '$http': 'provider', 'MyService': 'service' });
generate('service', 'MyService', { '$http': 'provider', 'MyService': 'service' });
generate('factory', 'MyFactory', { '$http': 'provider', 'MyService': 'service' });
generate('directive', 'myDir', { '$http': 'provider', 'MyService': 'service' });
generate('provider', 'MyProv', { '$http': 'provider', 'MyService': 'service' });
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
      throw new Error('Bad test: unit to found - ' + unit.name);
    }
    callback(unit);
  };

  askStub.identifyDeps = function (unknown, callback) {
    var identified = _.map(unknown, function (dep) {
      if (_.isUndefined(deps[dep.name])) {
        throw new Error('Bad test: dep not found - ' + dep.name);
      }
      dep.type = deps[dep.name];
      return dep;
    });
    callback(identified);
  };

  //

  var testPath = path.join(testBasePath, type + '.spec.js');

  // generate test file
  run.parse(appSourcePath, testPath);

  // load source of the generated test file
  var testSource = fs.readFileSync(testPath, 'utf8');

  // find end of the suite
  var target = '});';
  var index = testSource.lastIndexOf(target);
  if (index < 0) {
    throw new Error('Bad test: unable to find injection index');
  }

  var injection =
    'it("should work for ' + type + '", function () {' +
    ' expect(true).to.be.ok; ' +
    '});';

  var modifiedTestSource = testSource.substr(0, index) + injection +
    testSource.substr(index, testSource.length);

  fs.writeFileSync(testPath, modifiedTestSource, 'utf8');
}