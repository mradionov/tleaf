'use strict';

var _ = require('lodash');


function wrap(string, wrapper) {
  wrapper = wrapper || '_';
  return wrapper + string + wrapper;
}


// TODO: decide whether should recreate unit if it is bad or throw errors
function serialize(unit) {

  var data = {
    unit: unit
  };

  data.name = unit.name;
  data.module = unit.module.name;

  data.deps = _.map(unit.deps, function (unitDep) {

    // copy not to modify dep in unit
    var dep = _.merge({}, unitDep);

    dep._name_ = wrap(dep.name);

    dep.getType = function () {
      return this.type;
    };

    return dep;
  });

  data.arg = {};
  data.arg.deps = _.pluck(unit.deps, 'name');
  data.arg._deps_ = _.map(unit.deps, function (dep) {
    return wrap(dep.name);
  });

  return data;
}

module.exports = serialize;