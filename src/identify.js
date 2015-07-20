'use strict';

var fs = require('fs');
var _ = require('lodash');

var cachePath = __dirname + '/../test/cache.json';

function identify(unitNames) {

  var deps = {
    known: [],
    unknown: []
  };

  var excludeUnits = ['$scope'];

  var units = _.difference(unitNames, excludeUnits);

  if (!units.length) {
    deps.known = units;
    return deps;
  }

  if (!fs.existsSync(cachePath)) {
    deps.unknown = units;
    return deps;
  }

  var cache = JSON.parse(fs.readFileSync(cachePath).toString());

  units.forEach(function (unit) {
    var dep = _.find(cache, { name: unit });
    if (dep) {
      deps.known.push(dep);
    } else {
      deps.unknown.push({ name: unit });
    }
  });

  return deps;
}

module.exports = identify;