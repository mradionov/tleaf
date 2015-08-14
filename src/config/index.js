'use strict';

var fs = require('fs'),
    _ = require('lodash');

var cache = require('../cache');

var defaultConfig = require('./default');

////////

var useConfig = {};
var useConfigPath = cache.get('use');
if (useConfigPath && fs.existsSync(useConfigPath)) {
    useConfig = require(useConfigPath);
}

var resolvedConfig = _.merge({}, defaultConfig, useConfig);

module.exports = resolvedConfig;