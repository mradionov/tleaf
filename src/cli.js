'use strict';

var config = require('./config'),
    run = require('./run');

////////

// TODO: catch promise errors, because they are swallowed

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

  if (config.processedUnits.indexOf(args[0]) > -1) {
    run.create(args[0], args[1]);
    break;
  }

  if (args.length === 2) {
    run.parse(args[0], args[1]);
    break;
  }

  help();
}

function help() {
  console.log('USAGE:');
  console.log('\tinit /path/to/folder');
  console.log('\tcurrent');
  console.log('\t/path/to/source.js /path/to/output.spec.js');
}