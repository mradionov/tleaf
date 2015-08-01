'use strict';

var _ = require('lodash');

function serialize(unit) {

  var data = {
    unit: unit
  };

  data.name = unit.name;
  data.module = unit.module.name;
  data.deps = _.pluck(unit.deps, 'name');
  data._deps_ = _.map(unit.deps, function (dep) {
    return '_' + dep.name + '_';
  });

  return data;
}

module.exports = serialize;