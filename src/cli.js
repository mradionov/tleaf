'use strict';

var _ = require('lodash');

var C = require('./constants');
var run = require('./run');
var log = require('./log');
var UserError = require('./error/UserError');

////////

// handler for all unhandled errors
// might be a UserError, format it accordingly

process.on('uncaughtException', function (err) {
  if (err instanceof UserError) {
    log.pref(err.userMessage);
  } else {
    console.log(err.message);
  }
  if (err.stack) {
    console.log(err.stack);
  }
});

// inquirer may not work with some Windows terminal wrappers
// better show user friendly message about it
// https://github.com/SBoudrias/Inquirer.js/issues/272
if (!process.stdout.isTTY) {
  throw new UserError(
    'The type of the terminal you use is not supported (not tty).'
  );
}

// read user input

var args = process.argv.slice(2);
var command = args[0];

switch (command) {

case 'create':
  validate(args[1], 'Missing path to output file.', 'create');
  run.create(args[1]);
  break;

case 'init':
  run.init(args[1]);
  break;

case 'clone':
  run.clone(args[1]);
  break;

case 'use':
  validate(args[1], 'Missing path to config file.', 'use');
  run.use(args[1]);
  break;

case 'default':
  run.default();
  break;

case 'current':
  run.current();
  break;

default:

  if (args.length === 2) {
    run.parse(args[0], args[1]);
    break;
  }

  help();

}

////////


function validate(expression, message, command) {
  if (expression) { return; }
  log.pref(message);
  if (command) {
    help(command);
  }
  process.exit(0);
}


function help(one) {

  var commands = [
    {
      name: 'parse',
      usage: 'SOURCE DEST',
      description: 'Create a test by parsing existing AngularJS source file.'
    },
    {
      name: 'create',
      usage: 'create DEST',
      description: 'Create a test by manually entering details.'
    },
    {
      name: 'init',
      usage: 'init [DIRECTORY]',
      description: 'Initialize config file.'
    },
    {
      name: 'clone',
      usage: 'clone [DIRECTORY]',
      description: 'Copy default config and templates to a folder.'
    },
    {
      name: 'use',
      usage: 'use CONFIG',
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
    output += C.MODULE_NAME + ' - AngularJS unit test generator.';
    output += '\n';
  }

  output += '\n';
  output += 'Usage:';
  output += '\n';

  _.each(commands, function (command) {
    if (!one || one === command.name) {
      var message = '';
      message += '\n';
      message += '  ' + C.MODULE_NAME + ' ' + command.usage + '\n';
      message += '    ' + command.description + '\n';

      output += message;
    }
  });

  log.info(output);
}