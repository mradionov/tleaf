'use strict';

var fs = require('fs');
var _ = require('lodash');

var cache = require('../cache');

var defaultConfig = require('./default');

////////

var useConfig = {};
var useConfigPath = cache.get('useConfig');
if (useConfigPath && fs.existsSync(useConfigPath)) {
  // load custom config as module
  useConfig = require(useConfigPath);
}

// deep merge configs
var resolvedConfig = _.merge({}, defaultConfig, useConfig);

// TODO: check if units.process and dependencies.process are empty

module.exports = resolvedConfig;