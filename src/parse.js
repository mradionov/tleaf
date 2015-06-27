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
            node.callee.property.name === 'controller'
        ) {

          callExpressions.push(node);

        }

      }
    }
  });

  var details = {
    controllers: []
  };

  callExpressions.forEach(function (callExpression) {

    var argument = callExpression.arguments[0];


    var controller = {
      name: undefined
    };

    if (argument.type === 'Literal') {
      controller.name = argument.value;
    }

    details.controllers.push(controller);

  });

  return details;
}


module.exports = parse;