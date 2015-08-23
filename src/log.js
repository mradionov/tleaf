'use strict';

var _ = require('lodash');

////////

module.exports = log;

////////

function log() {
  var args = ['[tleaf]:'].concat(_.toArray(arguments));
  log.pure.apply(null, args);
}

log.pure = function () {
  console.log.apply(console.log, arguments);
};