'use strict';

var _ = require('lodash');

var config = require('./config/resolved'),
    run = require('./run');

////////

var args = process.argv.slice(2);
var command = args[0];

switch (command) {

case 'init':
  run.init(args[1]);
  break;

case 'use':
  run.use(args[1]);
  break;

case 'current':
  run.current();
  break;

default:

  if (_.contains(config.processedTypes, args[0])) {
    run.create(args[0], args[1]);
    break;
  }

  if (args.length === 2) {
    run.parse(args[0], args[1]);
    break;
  }

  run.help();
}