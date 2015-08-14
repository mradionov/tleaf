'use strict';

var fs = require('fs'),
    path = require('path'),
    ncp = require('ncp'),
    _ = require('lodash'),
    Q = require('q');

var parse = require('./parse'),
    ask = require('./ask'),
    identify = require('./identify'),
    cache = require('./cache'),
    serialize = require('./serialize'),
    render = require('./render'),
    template = require('./template');

////////

var run = module.exports = {};

////////

run.init = function (initPathArg) {
  var initPath = path.resolve(initPathArg);
  var defaultsPath = './defaults';
  var configFileName = 'config.js';

  return Q.nfcall(ncp, defaultsPath, initPath).then(function () {
    var configPath = path.join(initPath, configFileName);
    cache.set('useConfig', configPath);
  });
};


run.use = function (usePathArg) {
  var usePath = path.resolve(usePathArg);

  return Q.nfcall(fs.exists, usePath).then(function (exists) {
    if (!exists) {
      console.error('Config file not found');
      return false;
    }

    cache.set('useConfig', usePath);
  });
};


run.current = function () {
  var usePath = cache.get('use');
  if (usePath) {
    console.log('Current config path: %s', usePath);
  } else {
    console.log('Using default config');
  }
};


run.create = function (typeArg, outputPathArg) {
  var outputPath = path.resolve(outputPathArg);

  return ask.createUnit().then(function (unit) {
    unit.type = typeArg;
    return generate(outputPath, unit);
  });
};


run.parse = function (sourcePathArg, outputPathArg) {

  var sourcePath = path.resolve(sourcePathArg),
      outputPath = path.resolve(outputPathArg);

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

  var generateToPath = _.partial(generate, outputPath);

  if (units.length === 1) {
    return identifyDeps(_.first(units)).then(generateToPath);
  }

  return ask.pickUnit(units).then(identifyDeps).then(generateToPath);
};


////////


function identifyDeps(unit) {
  var deferred = Q.defer();

  var deps = identify(unit.deps);

  if (!deps.unknown.length) {
    unit.deps = deps.known;
    deferred.resolve(unit);
    return deferred.promise;
  }

  return ask.identifyDeps(deps.unknown).then(function (identified) {
    unit.deps = deps.known.concat(identified);
    return unit;
  });
}

function generate(outputPath, unit) {

  var source = template.unit(unit.type);

  var data = serialize(unit);

  var output = render(source, data);

  fs.writeFileSync(outputPath, output);
}