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
            (node.callee.property.name === 'controller' ||
             node.callee.property.name === 'module'
            )
        ) {

          callExpressions.push(node);

        }

      }
    }
  });

  var details = {
    controllers: [],
    modules: []
  };

  callExpressions.forEach(function (callExpression) {

    var type = callExpression.callee.property.name;

    if (type === 'module') {

      var nameArg = callExpression.arguments[0];

      var module = {
        name: undefined
      };

      if (nameArg.type === 'Literal') {
        module.name = nameArg.value;
      }

      details.modules.push(module);

    } else if (type === 'controller') {

      var nameArg = callExpression.arguments[0];
      var fnArg = callExpression.arguments[1];

      var controller = {
        name: undefined,
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

      details.controllers.push(controller);

    }

  });

  return details;
}


module.exports = parse;