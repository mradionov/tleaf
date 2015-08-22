'use strict';

var fs = require('fs-extra'),
    path = require('path'),
    _ = require('../lib/lodash.mixin');

var config = require('./config'),
    parse = require('./parse'),
    ask = require('./ask'),
    filter = require('./filter'),
    cache = require('./cache'),
    serialize = require('./serialize'),
    render = require('./render'),
    template = require('./template');

////////

var run = module.exports = {};

////////

run.init = function (initPathArg) {
  var initPath = path.resolve(initPathArg);
  var configFileName = 'config.js';
  var configPath = path.join(initPath, configFileName);
  var defaultsPath = path.join(__dirname, 'defaults');

  if (fs.existsSync(initPath)) {
    return console.log('[tleaf]: Directory (or file) already exists at this location. Use another path.');
  }

  fs.copySync(defaultsPath, initPath);
  cache.set('useConfig', configPath);
  run.current();
};


run.use = function (usePathArg) {
  var usePath = path.resolve(usePathArg);

  if (!fs.existsSync(usePath)) {
    return console.log('[tleaf]: Config file not found'); // TODO: throw?
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
    console.log('[tleaf]: Using default config'); // TODO: custom logger?
  } else {
    console.log('[tleaf]: Current config path: %s', usePath);
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
      console.error('[tleaf]: Source file not found');
      return false;
    }
  }

  var units = parse(source);

  var processedUnits = units.filter(function (unit) {
    return _.contains(config.units.process, unit.type);
  });

  if (!processedUnits.length) {
    console.error('[tleaf]: Could not find any units');
    return false;
  }

  units = _.sortByKeys(units, config.units.process, 'type');

  ask.pickUnit(units, function (pickedUnit) {
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
  var unknown = _.sortByKeys(deps.unknown, config.providers.process, 'type');

  ask.identifyDeps(unknown, function (identified) {
    unit.deps = deps.known.concat(identified);
    callback(unit);
  });
}


function generate(unit, outputPath) {

  unit.deps = _.sortByKeys(unit.deps, config.providers.process, 'type');

  var source = template.unit(unit.type);

  var data = serialize(unit);

  var output = render(source, data);

  fs.writeFileSync(outputPath, output);
}