'use strict';

var fs = require('fs-extra');
var path = require('path');
var _ = require('./lib/lodash.mixin');

var config = require('./config');
var parse = require('./parse');
var ask = require('./ask');
var filter = require('./filter');
var cache = require('./cache');
var serialize = require('./serialize');
var render = require('./render');
var template = require('./template');
var log = require('./log');
var UserError = require('./error/UserError');

////////

var run = module.exports = {};

////////

run.init = function (initPathArg) {
  var initPath = path.resolve(initPathArg);
  var configFileName = 'config.js';
  var configPath = path.join(initPath, configFileName);
  var defaultsPath = path.join(__dirname, 'defaults');

  if (fs.existsSync(initPath)) {
    throw new UserError(
      'Directory (or file) already exists at this location. Use another path.'
    );
  }

  cache.set('useConfig', configPath);

  try {
    fs.copySync(defaultsPath, initPath);
  } catch (err) {
    if (err.code === 'EACCES') {
      throw new UserError('Not enough permissions to create directory.', err);
    }
    cache.remove('useConfig');
  }

  run.current();
};


run.use = function (usePathArg) {
  var usePath = path.resolve(usePathArg);

  if (!fs.existsSync(usePath)) {
    throw new UserError('Configuration file not found.');
  }

  cache.set('useConfig', usePath);
  run.current();
};


run.default = function () {
  cache.remove('useConfig');
  run.current();
};


run.current = function () {
  var usePath = cache.get('useConfig');
  if (!usePath) {
    log.pref('Using default config.');
  } else {
    log.pref('Current config path: %s.', usePath);
  }
};


run.create = function (outputPathArg) {
  var outputPath = path.resolve(outputPathArg);

  ask.createUnit(function (unit) {
    generate(unit, outputPath);
  });
};


run.parse = function (sourcePathArg, outputPathArg) {
  var sourcePath = path.resolve(sourcePathArg),
      outputPath = path.resolve(outputPathArg);

  var source = '';
  try {
    source = fs.readFileSync(sourcePath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new UserError('Source file not found.');
    }
  }

  var units = parse(source);

  var processedUnits = units.filter(function (unit) {
    return _.contains(config.units.process, unit.type);
  });

  if (!processedUnits.length) {
    throw new UserError('Could not find any units.');
  }

  units = _.sortByKeys(units, config.units.process, 'type');

  ask.pickUnit(units, function (pickedUnit) {

    if (units.length === 1) {
      log.pref(
        'Generating test file for %s "%s" from module "%s" ...',
        pickedUnit.type, pickedUnit.name, pickedUnit.module.name
      );
    }

    identify(pickedUnit, function (unit) {
      generate(unit, outputPath);
    });
  });
};


////////


function identify(unit, callback) {
  var deps = filter(unit.deps);

  if (!deps.unknown.length) {
    unit.deps = deps.known;
    return callback(unit);
  }

  // sort before asking
  var unknown = _.sortByKeys(deps.unknown, config.dependencies.process, 'type');

  ask.identifyDeps(unknown, function (identified) {
    unit.deps = deps.known.concat(identified);
    callback(unit);
  });
}


function generate(unit, outputPath) {

  unit.deps = _.sortByKeys(unit.deps, config.dependencies.process, 'type');

  var source = template.unit(unit.type);

  var data = serialize(unit);

  var output = render(source, data);

  try {
    fs.writeFileSync(outputPath, output);
  } catch (err) {
    if (err.code === 'EACCES') {
      throw new UserError(
        'Not enough permissions to create test file at this location.'
      );
    }
  }

  log.pref(
    'Test file for %s "%s" from module "%s" saved to %s.',
    unit.type, unit.name, unit.module.name, outputPath
  );
}