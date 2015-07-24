'use strict';

var esprima = require('esprima'),
    estraverse = require('estraverse'),
    _ = require('lodash');

var TYPES = [
  'controller'
];


function parse(source) {

  var syntax = esprima.parse(source);

  var callExpressions = [];
  var variableDeclarators = [];

  estraverse.traverse(syntax, {
    enter: function (node) {

      if (node.type === 'CallExpression') {

        if (node.callee.property &&
            (node.callee.property.name === 'controller'
            )
        ) {

          callExpressions.unshift(node);

        }

      } else if (node.type === 'VariableDeclaration') {
        variableDeclarators.unshift.apply(variableDeclarators, node.declarations);
      }
    }
  });

  var units = [];

  callExpressions.forEach(function (callExpression) {

    var type = callExpression.callee.property.name;
    if (type === 'controller') {

      var controller = {
        name: findName(callExpression),
        type: 'controller',
        module: findModule(callExpression, variableDeclarators),
        deps: findDeps(callExpression)
      };

      units.unshift(controller);

    }

  });

  return units;
}

function findVariableDeclarator(varName, variableDeclarators) {
  var variableDeclarator = _.filter(variableDeclarators, function (vd) {
    return vd.id.name === varName;
  });

  return _.first(variableDeclarator);
}

function findName(callExpression) {
  var name;

  var nameArg = callExpression.arguments[0] || {};
  if (nameArg.type === 'Literal') {
    name = nameArg.value;
  }

  return name;
}

// TODO: is "module" a reserved word in node.js? is it safe to use? if scoped?
function findModule(callExpression, variableDeclarators) {
  var module;

  if (callExpression.callee.object.type === 'CallExpression') {

    return findModule(callExpression.callee.object, variableDeclarators);

  } else if (callExpression.callee.object.type === 'Identifier') {

    if (callExpression.callee.property.name === 'module' &&
      callExpression.callee.object.name === 'angular'
    ) {

      module = callExpression.arguments[0].value;

    } else if (_.contains(TYPES, callExpression.callee.property.name)) {

      var varName = callExpression.callee.object.name;
      var varDeclarator = findVariableDeclarator(varName, variableDeclarators);
      if (varDeclarator && varDeclarator.init.callee.property.name === 'module') {

        module = varDeclarator.init.arguments[0].value;

      } else {
        // uncovered
      }

    } else {
      // uncovered
    }

  } else {
    // uncovered
  }

  return module;
}

function findDeps(callExpression) {
  var deps = [];

  var depsArg = callExpression.arguments[1] || {};

  if (depsArg.type === 'ArrayExpression') {
    depsArg = _.last(depsArg.elements) || {};
  }

  if (depsArg.type === 'FunctionExpression') {
    depsArg.params.forEach(function (param) {
      if (param.type === 'Identifier') {
        deps.push(param.name);
      }
    });
  }

  return deps;
}

module.exports = parse;