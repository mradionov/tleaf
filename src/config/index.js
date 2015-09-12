'use strict';

var fs = require('fs-extra');
var _ = require('lodash');

var cache = require('../cache');

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

var useConfig = {};
var useConfigPath = cache.get('useConfig');
if (useConfigPath && fs.existsSync(useConfigPath)) {
  // load custom config as module
  useConfig = require(useConfigPath);
  // call user config module function providing config API
  useConfig(config);
}

// TODO: check if units.process and dependencies.process are empty

module.exports = resolvedConfig;