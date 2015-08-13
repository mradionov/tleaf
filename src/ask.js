'use strict';

var inquirer = require('inquirer');
var _ = require('lodash');

var TYPES = [
  'controller',
  'service',
  'provider'
];

function unit(units, callback) {

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

  inquirer.prompt([question], function (answers) {
    var unit = units[answers.unit];
    callback(unit);
  });
}

function deps(unknown, callback) {

  var questions = unknown.map(function (dep, index) {
    return {
      type: 'list',
      name: index.toString(),
      message: 'What is a type of "' + dep.name + '"?',
      choices: TYPES
    };
  });

  inquirer.prompt(questions, function (answers) {

    var identified = _.map(answers, function (type, index) {

      var dep = unknown[index];

      return {
        name: dep.name,
        type: type
      };

    });

    callback(identified);
  });

}


function name(callback) {

  var questions = [
    {
      type: 'input',
      name: 'name',
      message: 'What is a name of the unit?'
    },
    {
      type: 'input',
      name: 'module',
      message: 'What is a name of the module for this unit?'
    },
    {
      type: 'confirm',
      name: 'hasDeps',
      message: 'Does unit has dependencies?'
    }
  ];

  inquirer.prompt(questions, function (answers) {

    var res = {
      name: answers.name,
      module: answers.name,
      deps: []
    };

    if (answers.hasDeps) {

      dep(null, function (depys) {

        res.reps = depys;

        callback(res);

      });

    } else {
      callback(res);
    }

  });
}

function dep(depys, callback) {

  depys = depys || [];

  var nameQuestion = {
    type: 'input',
    name: 'name',
    message: 'What is a name of the dependency? ("Enter" to skip)'
  };

  var typeQuestion = {
    type: 'list',
    name: 'type',
    message: 'What is a type of the dependency?',
    choices: TYPES
  };

  inquirer.prompt(nameQuestion, function (nameAnswer) {

    if (!nameAnswer.name) {

      callback(depys);

    } else {

      inquirer.prompt(typeQuestion, function (typeAnswer) {

        console.log(typeAnswer);

        var depy = {
          name: nameAnswer.name,
          type: typeAnswer.type
        };

        depys.push(depy);

        dep(depys, callback);

      });

    }

  });
}

var ask = {
  unit: unit,
  deps: deps,
  name: name,
  dep: dep
};

module.exports = ask;