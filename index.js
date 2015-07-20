'use strict';

var fs = require('fs');

var inquirer = require('inquirer'),
    _ = require('lodash');

var parse = require('./src/parse.js'),
    identify = require('./src/identify.js'),
    cache = require('./src/cache.js'),
    generate = require('./src/generate.js');

////////

var args = process.argv.slice(2);

if (!args.length) {
  console.error('Specify pass to a file');
  return false;
}

var targetPath = args[0];
var templatePath = './src/templates/controller.tpl.js';
var testPath = './test/output/controller1.spec.js';

fs.readFile(targetPath, function (err, targetSource) {
  if (err) { throw err; }

  var units = parse(targetSource.toString());

  var question = {
    type: 'list',
    name: 'unit',
    message: 'What unit do you want to test?',
    choices: function () {
      return units.map(function (unit, index) {
        return {
          name: 'Module "' + unit.module + '": ' + unit.type + ' "' + unit.name + '"',
          value: index
        };
      });
    }
  };

  inquirer.prompt([question], function (answers) {

    var unit = units[answers.unit];

    var deps = identify(unit.deps);
    var alldeps = [];

    if (deps.unknown.length) {

      var depsQuestions = deps.unknown.map(function (dep, index) {
        return {
          type: 'list',
          name: index.toString(),
          message: 'What is a type of ' + dep.name + '?',
          choices: [
            'controller',
            'service',
            'provider'
          ]
        };
      });

      inquirer.prompt(depsQuestions, function (depsAnswers) {

        var depsToCache = _.map(depsAnswers, function (type, index) {

          var dep = deps.unknown[index];

          return {
            name: dep.name,
            type: type
          };

        });

        cache(depsToCache);


        alldeps = deps.known.concat(depsToCache);
        finish(unit, alldeps);
      });



    } else {
      finish(unit, deps.known);
    }

  });


  function finish(unit, deps) {

    var model = {
      unit: {
        name: unit.name,
        module: {
          name: unit.module
        },
        deps: deps
      }
    };

    fs.readFile(templatePath, function (err, templateSource) {
      if (err) { throw err; }

      var testSource = generate('controller', templateSource.toString(), model);

      fs.writeFile(testPath, testSource, function (err) {
        if (err) { throw err; }
      });

    });

  }

});