'use strict';

var fs = require('fs');
var _ = require('lodash');

var cachePath = __dirname + '/../test/cache.json';

function identify(all) {

  var deps = {
    known: [],
    unknown: []
  };

  var exclude = ['$scope', '$http'];

  var filtered = _.filter(all, function (dep) {
    return !_.contains(exclude, dep.name);
  });

  if (!filtered.length) {
    deps.known = filtered;
    return deps;
  }


  if (!fs.existsSync(cachePath)) {
    deps.unknown = filtered;
    return deps;
  }

  var cache = JSON.parse(fs.readFileSync(cachePath).toString());

  filtered.forEach(function (dep) {
    var found = _.find(cache, { name: dep.name });
    if (found) {
      deps.known.push({
        name: dep.name,
        type: found.type
      });
    } else {
      deps.unknown.push({ name: dep.name });
    }
  });

  return deps;
}

module.exports = identify;