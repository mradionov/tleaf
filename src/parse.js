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

  var units = [];

  callExpressions.forEach(function (callExpression) {

    var nameArg, fnArg;
    var type = callExpression.callee.property.name;

    /* module branch irrelevant */
    if (type === 'module') {
      return;

      nameArg = callExpression.arguments[0];

      var module = {
        name: undefined
      };

      if (nameArg.type === 'Literal') {
        module.name = nameArg.value;
      }


    } else if (type === 'controller') {

      nameArg = callExpression.arguments[0];
      fnArg = callExpression.arguments[1];

      var controller = {
        name: undefined,
        type: 'controller',
        module: 'app',
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

    } else if (type === 'service') {

      nameArg = callExpression.arguments[0];
      fnArg = callExpression.arguments[1];

      var service = {
        name: undefined,
        type: 'service',
        module: 'app',
        deps: []
      };

      if (nameArg.type === 'Literal') {
        service.name = nameArg.value;
      }

      if (fnArg.type === 'FunctionExpression') {
        fnArg.params.forEach(function (param) {
          if (param.type === 'Identifier') {
            service.deps.push(param.name);
          }
        });
      }

      units.push(service);
    }

  });

  return units;
}


module.exports = parse;