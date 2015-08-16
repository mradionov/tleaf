'use strict';

var _ = require('lodash');

////////

module.exports = filter;

////////

// TODO: cache identified deps for respective project
function filter(all, options) {
  options = _.defaults(options || {}, {
    exclude: []
  });

  var deps = {
    known: [],
    unknown: []
  };

  var filtered = _.filter(all, function (dep) {
    return !_.contains(options.exclude, dep.name);
  });

  deps.unknown = filtered;

  return deps;
}