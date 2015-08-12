'use strict';

var fs = require('fs'),
    path = require('path'),
    ncp = require('ncp'),
    _ = require('lodash');

var parse = require('./src/parse'),
    ask = require('./src/ask'),
    identify = require('./src/identify'),
    cache = require('./src/cache'),
    serialize = require('./src/serialize'),
    generate = require('./src/generate');

var defaultConfig = require('./src/defaults/config');

////////

var args = process.argv.slice(2);

if (!args.length) {
  console.log('USAGE:');
  console.log('\tinit /path/to/folder');
  console.log('\tcurrent');
  console.log('\t/path/to/source.js /path/to/output.spec.js');
  return;
}

switch (args[0]) {
case 'init':
  // TODO: default path and name
  var defaultsPath = './src/defaults';
  var configFileName = 'config.js';
  var initPath = args[1];

  ncp(defaultsPath, initPath, function (err) {
    if (err) { return console.error(err); }
  });

  var useDir = path.resolve(initPath);
  var usePath = path.join(useDir, configFileName);

  cache.set('use', usePath);
  return;

case 'use':
  var usePath = path.resolve(args[1]);

  if (!fs.existsSync(usePath)) {
    console.error('Config file not found');
    return false;
  }

  cache.set('use', usePath);
  return;

case 'current':

  var usePath = cache.get('use');
  if (usePath) {
    console.log('Current config path: %s', usePath);
  } else {
    console.log('Using default config');
  }
  return;

default:
  var types = [
    'controller', 'directive', 'factory', 'filter', 'provider', 'service'
  ];
  if (_.contains(types, args[0])) {

    var outputPath = args[1];

    ask.name();

    return;
  }
}

if (args.length < 2) {
  console.error('Specify pass to a source file and to destination file');
  return false;
}



var sourcePath = args[0];
var outputPath = args[1];
var useConfigPath = cache.get('use');
var config;
if (useConfigPath && fs.existsSync(useConfigPath)) {
    var useConfig = require(useConfigPath);
    config = _.defaults({}, useConfig, defaultConfig);
} else {
  config = defaultConfig;
}

if (!fs.existsSync(sourcePath)) {
  console.error('Source file not found');
  return false;
}

var source = fs.readFileSync(sourcePath, 'utf8');

var units = parse(source);

if (!units.length) {
  console.error('Could not find any units');
  return false;
}

if (units.length === 1) {
  unitFn(_.first(units));
} else {
  ask.unit(units, unitFn);
}

function unitFn(unit) {

  var deps = identify(unit.deps);

  if (!deps.unknown.length) {

    unit.deps = deps.known;

    depsFn(unit);

  } else {

    ask.deps(deps.unknown, function (identified) {

      cache.set('deps', identified);

      unit.deps = deps.known.concat(identified);

      depsFn(unit);

    });

  }

}

function depsFn(unit) {

  var unitFileName = unit.type + '.tpl.js';

  var defaultTemplateDir = './src/defaults/templates/';

  var templatePath = path.join(defaultTemplateDir, unitFileName);

  var usePath = cache.get('use');
  if (usePath) {

    var useDir = path.dirname(usePath);
    var useTemplateDir = path.join(useDir, 'templates');
    var useTemplatePath = path.join(useTemplateDir, unitFileName);

    if (fs.existsSync(useTemplatePath)) {
      templatePath = useTemplatePath;
    } else {
      console.error('Custom template is missing for type "%s"', unit.type);
      console.error('Falling back default template');
    }

  }

  var template = fs.readFileSync(templatePath, 'utf-8');

  var data = serialize(unit);

  var options = {
    indent: config.indent
  };

  var output = generate(template, data, options);

  fs.writeFileSync(outputPath, output);

}