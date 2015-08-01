'use strict';

var _ = require('lodash');

// TODO: decide whether should recreate unit if it is bad or throw errors
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

  // TODO ?
  // depsArg or arg.deps
  // andDepsArg or and.arg.deps
  // _depsArg_ or _arg.deps_ or arg._deps_
  // _andDepsArg_ or _and.arg.deps_ or and.arg._deps_

  return data;
}

module.exports = serialize;