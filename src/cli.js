'use strict';

var _ = require('lodash');
var run = require('./run');

////////

var args = process.argv.slice(2);
var command = args[0];
var p;

switch (command) {

case 'create':
  validate(args[1], 'Missing path to output file', 'create');
  p = run.create(args[1]);
  break;

case 'init':
  validate(args[1], 'Missing path to output folder', 'init');
  p = run.init(args[1]);
  break;

case 'use':
  validate(args[1], 'Missing path to config file', 'use');
  p = run.use(args[1]);
  break;

case 'default':
  p = run.default();
  break;

case 'current':
  p = run.current();
  break;

default:

  if (args.length === 2) {
    p = run.parse(args[0], args[1]);
    break;
  }

  help();

}

if (p && _.isFunction(p.then)) {

  p.catch(function (err) {
    console.log('Caught error:');
    console.error(err.message);
    console.error(err.stack);
  });

}

////////

function validate(expression, message, command) {
  if (expression) { return; }
  console.log('[tleaf]: %s', message);
  if (command) {
    help(command);
  }
  process.exit(0);
}

function help(one) {

  var commands = [
    {
      name: 'parse',
      usage: '[/path/to/source.js] [/path/to/output.spec.js]',
      description: 'Create a test by parsing existing AngularJS source file.'
    },
    {
      name: 'create',
      usage: 'create [/path/to/output.spec.js]',
      description: 'Create a test by manually entering details.'
    },
    {
      name: 'init',
      usage: 'init [/path/to/folder]',
      description: 'Copy default config and templates to a folder.'
    },
    {
      name: 'use',
      usage: 'use [/path/to/config.js]',
      description: 'Use destination config and templates.'
    },
    {
      name: 'default',
      usage: 'default',
      description: 'Use default config and templates.'
    },
    {
      name: 'current',
      usage: 'current',
      description: 'Show path of currently used config.'
    },

  ];

  var output = '';

  if (!one) {
    output += '\n';
    output += 'tleaf - AngularJS unit test generator';
    output += '\n';
  }

  output += '\n';
  output += 'Usage:';
  output += '\n';

  _.each(commands, function (command) {
    if (!one || one === command.name) {
      var message = '';
      message += '\n';
      message += '  tleaf ' + command.usage + '\n';
      message += '    ' + command.description + '\n';

      output += message;
    }
  });

  console.log(output);
}