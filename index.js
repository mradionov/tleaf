'use strict';

var C = require('./src/constants');

// throw an error when require-ing the module
throw new Error('Module "' + C.MODULE_NAME + '" can only be used from a terminal.');