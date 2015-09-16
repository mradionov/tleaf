'use strict';

var _ = require('lodash');

var C = require('../constants');
var cache = require('../cache');
var log = require('../log');
var UserError = require('../error/UserError');

var defaultConfig = require('./default');

////////

var resolvedConfig = {};

// create API for config module
var config = {
  set: function (options) {
    _.merge(resolvedConfig, options, function (a, b) {
      // do not merge arrays, but replace
      if (_.isArray(a) && _.isArray(b)) {
        return b;
      }
    });
  }
};

// call config module function providing config API
defaultConfig(config);

var useConfigPath = cache.get('useConfig');
if (useConfigPath) {

  var useConfig = _.noop;

  try {
    // load custom config as module
    useConfig = require(useConfigPath);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      log.pref('Could not load cached config path. Switching to default config.');
      cache.remove(C.CACHE_USE_CONFIG_KEY);
    }
  }

  // call user config module function providing config API
  useConfig(config);
}

if (!resolvedConfig.units.process.length) {
  throw new UserError('Config option "units.process" can not be empty.');
}

module.exports = resolvedConfig;