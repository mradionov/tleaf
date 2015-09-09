'use strict';

var _ = require('lodash');

////////

var helpers = module.exports = {};

////////


helpers.and = function (array) {
  return leftJoin(array);
};


helpers.only = function (array) {
  return join(array);
};


helpers.dashCase = function (string) {
  return _.snakeCase(string).replace(/_/g, '-');
};


helpers.defaults = function (value, defaultValue) {
  return _.isUndefined(value) ? defaultValue: value;
};

////////

function join(array, delimiter) {
  return (array || []).join(delimiter || ', ');
}


function leftJoin(array, delimiter) {
  if (!(array && array.length)) { return ''; }
  var copy = array.slice();
  copy.unshift('');
  return join(copy, delimiter);
}