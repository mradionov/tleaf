'use strict';

var inquirer = require('inquirer'),
    _ = require('lodash');

////////

var ask = module.exports = {};

////////


ask.createUnit = function(options, callback) {
  options = _.defaults(options || {}, {
    units: [],
    providers: []
  });
  callback = callback || _.noop;

  if (!options.units.length) {
    return callback(new Error('No units to process'));
  }
  if (!options.providers.length) {
    return callback(new Error('No providers to process'));
  }

  var questions = [
    { type: 'list', name: 'type', message: 'Unit type:', choices: options.units },
    { type: 'input', name: 'name', message: 'Unit name:', validate: required },
    { type: 'input', name: 'module', message: 'Module name:', validate: required }
  ];

  inquirer.prompt(questions, function (answers) {

    var unit = {
      name: answers.name,
      type: answers.type,
      module: { name: answers.module },
      deps: []
    };

    // unit.deps will be populated by reference
    addUnitDependency(unit.deps, options, function () {
      callback(null, unit);
    });

  });

};

/*
ask.pickUnit = function (units) {

  var question = {
    type: 'list',
    name: 'unit',
    message: 'What unit do you want to test?',
    choices: function () {
      return units.map(function (unit, index) {
        return {
          name: [
            _.capitalize(unit.type),
            '"' + unit.name + '"',
            'from module',
            '"' + unit.module.name + '"'
          ].join(' '),
          value: index
        };
      });
    }
  };

  return prompt(question).then(function (answer) {
    var unit = units[answer.unit];
    return unit;
  });
};


ask.identifyDeps = function (unknown) {

  var questions = unknown.map(function (dep, index) {
    return {
      type: 'list',
      name: index.toString(),
      message: 'What is a type of "' + dep.name + '"?',
      choices: config.processedUnits
    };
  });

  return prompt(questions).then(function (answers) {

    var identified = _.map(answers, function (type, index) {
      var dep = unknown[index];
      return {
        name: dep.name,
        type: type
      };
    });

    return identified;
  });

};
*/


////////


function addUnitDependency(deps, options, callback) {

  var nameQuestion = {
    type: 'input',
    name: 'name',
    message: 'Dependency name ("Enter" to skip): '
  };

  var typeQuestion = {
    type: 'list',
    name: 'type',
    message: 'Dependency type:',
    choices: options.providers
  };

  inquirer.prompt(nameQuestion, function (nameAnswer) {

    // exit when nothing entered
    if (!nameAnswer.name) {
      // resolve recursive chain with all collected deps
      callback();
      return;
    }

    inquirer.prompt(typeQuestion, function (typeAnswer) {
      var dep = {
        name: nameAnswer.name,
        type: typeAnswer.type
      };
      deps.push(dep);

      // recursive, pass deps array along the way until everything resolves
      addUnitDependency(deps, options, callback);
    });

  });

}

function required(input) {
  if (_.isEmpty(_.trim(input))) {
    return 'Value is required';
  }
  return true;
}