'use strict';

var fs = require('fs'),
    path = require('path'),
    ncp = require('ncp'),
    _ = require('lodash'),
    Q = require('q');

var parseSource = require('./parse'),
    ask = require('./ask'),
    identify = require('./identify'),
    cache = require('./cache'),
    serialize = require('./serialize'),
    generate = require('./generate');

var config = require('./config/resolved');

////////

var run = {
    init: init,
    use: use,
    current: current,
    create: create,
    parse: parse,
    help: help
};

module.exports = run;

////////


function init(initPathArg) {
  var initPath = path.resolve(initPathArg);
  var defaultsPath = './defaults';
  var configFileName = 'config.js';

  return Q.nfcall(ncp, defaultsPath, initPath).then(function () {
    var configPath = path.join(initPath, configFileName);
    cache.set('useConfig', configPath);
  });
}


function use(usePathArg) {
  var usePath = path.resolve(usePathArg);

  return Q.nfcall(fs.exists, usePath).then(function (exists) {
    if (!exists) {
      console.error('Config file not found');
      return false;
    }

    cache.set('useConfig', usePath);
  });
}


function current() {
  var usePath = cache.get('use');
  if (usePath) {
    console.log('Current config path: %s', usePath);
  } else {
    console.log('Using default config');
  }
}


function create(typeArg, outputPathArg) {
  var outputPath = path.resolve(outputPathArg);

  ask.createUnit().then(function (unit) {
    unit.type = typeArg;
    depsFn(unit, outputPath);
  });
}


function parse(sourcePathArg, outputPathArg) {

  var sourcePath = path.resolve(sourcePathArg),
      outputPath = path.resolve(outputPathArg);

  if (!fs.existsSync(sourcePath)) {
    console.error('Source file not found');
    return false;
  }

  var source = fs.readFileSync(sourcePath, 'utf8');

  var units = parseSource(source);

  if (!units.length) {
    console.error('Could not find any units');
    return false;
  }

  if (units.length === 1) {
    unitFn(_.first(units), outputPath);
  } else {
    ask.pickUnit(units).then(function (unit) {
      unitFn(unit, outputPath);
    });
  }

}


function help() {
  console.log('USAGE:');
  console.log('\tinit /path/to/folder');
  console.log('\tcurrent');
  console.log('\t/path/to/source.js /path/to/output.spec.js');
}


////////


function unitFn(unit, outputPath) {

  var deps = identify(unit.deps);

  if (!deps.unknown.length) {

    unit.deps = deps.known;

    depsFn(unit, outputPath);

  } else {

    ask.identifyDeps(deps.unknown).then(function (identified) {

      cache.set('deps', identified);

      unit.deps = deps.known.concat(identified);

      depsFn(unit, outputPath);

    });

  }

}

function depsFn(unit, outputPath) {

  var unitFileName = unit.type + '.tpl.js';

  var defaultTemplateDir = './src/defaults/templates/';

  var templatePath = path.join(defaultTemplateDir, unitFileName);

  var usePath = cache.get('useConfig');
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