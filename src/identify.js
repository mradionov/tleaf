'use strict';

var _ = require('lodash');

////////

module.exports = identify;

////////

// TODO: cache identified deps for respective project
function identify(all) {

  var deps = {
    known: [],
    unknown: []
  };

  var exclude = ['$scope', '$http'];

  var filtered = _.filter(all, function (dep) {
    return !_.contains(exclude, dep.name);
  });

  deps.unknown = filtered;

  return deps;
}