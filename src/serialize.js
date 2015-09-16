'use strict';

var _ = require('lodash');

var config = require('./config');

////////

module.exports = serialize;

////////


function serialize(unit) {

  var data = {
    unit: unit
  };

  data.name = unit.name;
  data._name_ = wrap(unit.name);

  data.module = unit.module.name;

  data.deps = _.map(unit.deps, function (unitDep) {

    // copy not to modify dep in unit
    var dep = _.merge({}, unitDep);

    dep._name_ = wrap(dep.name);

    dep.partial = function () {
      return this.type;
    };

    return dep;
  });

  data.arg = {};
  data.arg.deps = _.pluck(unit.deps, 'name');
  data.arg._deps_ = _.map(unit.deps, function (dep) {
    return wrap(dep.name);
  });

  data.opts = _.pick(config.template, [
    'useStrict', 'includeSamples'
  ]);

  return data;
}


////////


function wrap(string, wrapper) {
  wrapper = wrapper || '_';
  return wrapper + string + wrapper;
}