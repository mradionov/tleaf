'use strict';

var _ = require('lodash');

var C = require('./constants');

////////

var log = module.exports = {};

////////

log.info = function () {
  console.log.apply(console, arguments);
};

log.warn = function () {
  console.warn.apply(console, arguments);
};

log.error = function () {
  console.error.apply(console, arguments);
};

log.pref = function () {
  var prefix = '[' + C.MODULE_NAME + ']: ';
  var args = _.toArray(arguments);
  var first = prefix += args.shift();
  console.log.apply(console, [first].concat(args));
};