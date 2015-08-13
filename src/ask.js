'use strict';

var inquirer = require('inquirer'),
    _ = require('lodash'),
    Q = require('q');

////////

var ask = {
  createUnit: createUnit,
  pickUnit: pickUnit,
  identifyDeps: identifyDeps
};

module.exports = ask;

////////

var TYPES = [
  'controller',
  'service',
  'provider'
];

function prompt(questions) {
    var deffered = Q.defer();
    inquirer.prompt(questions, function (answers) {
      deffered.resolve(answers);
    });
    return deffered.promise;
}

function createUnit() {

  var questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Unit name:'
    },
    {
      type: 'input',
      name: 'module',
      message: 'Module name:'
    },
    {
      type: 'confirm',
      name: 'hasDeps',
      message: 'Has dependencies?'
    }
  ];

  return prompt(questions).then(function (answers) {

    var unit = {
      name: answers.name,
      module: { name: answers.module },
      deps: []
    };

    if (!answers.hasDeps) {
      return unit;
    }

    return addUnitDependency().then(function (deps) {
      unit.deps = deps;
      return unit;
    });

  });

}

function addUnitDependency(deps) {

  deps = deps || [];

  var nameQuestion = {
    type: 'input',
    name: 'name',
    message: 'Dependency name ("Enter" to skip): '
  };

  var typeQuestion = {
    type: 'list',
    name: 'type',
    message: 'Dependency type:',
    choices: TYPES
  };

  return prompt(nameQuestion).then(function (nameAnswer) {

    // exit when nothing entered
    if (!nameAnswer.name) {
      // resolve recursive chain with all collected deps
      return deps;
    }

    return prompt(typeQuestion).then(function (typeAnswer) {
      var dep = {
        name: nameAnswer.name,
        type: typeAnswer.type
      };
      deps.push(dep);

      // recursive, pass deps array along the way until everything resolves
      return addUnitDependency(deps);
    });

  });

}

function pickUnit(units) {

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
}

function identifyDeps(unknown) {

  var questions = unknown.map(function (dep, index) {
    return {
      type: 'list',
      name: index.toString(),
      message: 'What is a type of "' + dep.name + '"?',
      choices: TYPES
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

}