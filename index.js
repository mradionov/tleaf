'use strict';

var fs = require('fs'),
    _ = require('lodash');

var parse = require('./src/parse'),
    ask = require('./src/ask'),
    identify = require('./src/identify'),
    cache = require('./src/cache'),
    generate = require('./src/generate');

////////

var args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Specify pass to a source file and to destination file');
  return false;
}

var sourcePath = args[0];
var outputPath = args[1];


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

    depsFn(unit);

  } else {

    ask.deps(deps.unknown, function (identified) {

      cache(identified);

      unit.deps = deps.known.concat(identified);

      depsFn(unit);

    });

  }

}

function depsFn(unit) {

  var model = {
    unit: {
      name: unit.name,
      module: {
        name: unit.module.name
      },
      deps: unit.deps
    }
  };

  var templatePath = './src/templates/' + unit.type + '.tpl.js';

  if (!fs.existsSync(templatePath)) {
    console.error('Template is missing for type "%s"', unit.type);
    return false;
  }

  var template = fs.readFileSync(templatePath, 'utf-8');

  var output = generate(unit.type, template, model);

  fs.writeFileSync(outputPath, output);

}