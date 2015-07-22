'use strict';

var esprima = require('esprima'),
    estraverse = require('estraverse');


function parse(source) {

  var syntax = esprima.parse(source);

  var callExpressions = [];

  estraverse.traverse(syntax, {
    enter: function (node) {

      if (node.type === 'CallExpression') {

        if (node.callee.property &&
            (node.callee.property.name === 'controller'
            )
        ) {

          callExpressions.push(node);

        }

      }
    }
  });

  var units = [];

  callExpressions.forEach(function (callExpression) {

    var nameArg, fnArg;
    var type = callExpression.callee.property.name;

    if (type === 'controller') {

      nameArg = callExpression.arguments[0];
      fnArg = callExpression.arguments[1];

      var module = callExpression.callee.object.arguments[0].value;

      var controller = {
        name: undefined,
        type: 'controller',
        module: module,
        deps: []
      };

      if (nameArg.type === 'Literal') {
        controller.name = nameArg.value;
      }

      if (fnArg.type === 'FunctionExpression') {
        fnArg.params.forEach(function (param) {
          if (param.type === 'Identifier') {
            controller.deps.push(param.name);
          }
        });
      }

      units.push(controller);

    }

  });

  return units;
}


module.exports = parse;