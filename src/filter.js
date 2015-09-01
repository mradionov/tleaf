'use strict';

var _ = require('lodash');

var config = require('./config');

////////

module.exports = filter;

////////

// TODO: cache identified deps for respective project
function filter(all) {

  var deps = {
    known: [],
    unknown: []
  };

  var filtered = _.filter(all, function (dep) {
    return !_.contains(config.dependencies.filter, dep.name);
  });

  deps.unknown = filtered;

  return deps;
}