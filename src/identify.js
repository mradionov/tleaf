'use strict';

var fs = require('fs');
var _ = require('lodash');

var cache = require('./cache');

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

  var depsCache = cache.get('deps', []);

  if (!depsCache.length) {
    deps.unknown = filtered;
    return deps;
  }

  filtered.forEach(function (dep) {
    var found = _.find(depsCache, { name: dep.name });
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