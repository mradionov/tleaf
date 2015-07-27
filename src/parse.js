'use strict';

var esprima = require('esprima'),
    estraverse = require('estraverse'),
    escope = require('escope'),
    _ = require('lodash');

var TYPES = [
  'controller'
];


function parse(source) {

  var ast = esprima.parse(source);
  var scopeManager = escope.analyze(ast);

  // global scope
  var currentScope = scopeManager.acquire(ast);

  var calls = [];

  estraverse.traverse(ast, {
    enter: function (node) {

      if (node.type === 'CallExpression') {

        if (_.contains(TYPES, _.get(node, 'callee.property.name'))) {

          calls.push({
            node: node,
            scope: currentScope
          });

        }

      }

      if (/Function/.test(node.type)) {
        currentScope = scopeManager.acquire(node);
      }
    },
    leave: function (node) {

      if (/Function/.test(node.type)) {
        currentScope = currentScope.upper;
      }

    }
  });


  var units = [];

  calls.forEach(function (call) {

    var callExpression = call.node, scope = call.node;

    units.push({
      name: findName(call.node, call.scope),
      type: 'controller',
      module: findModule(call.node, call.scope),
      deps: findDeps(call.node, call.scope)
    });

  });

  return units;
}

function findName(callExpression, scope) {
  var name;

  var nameArg = callExpression.arguments[0] || {};
  if (nameArg.type === 'Literal') {
    name = nameArg.value;
  }

  return name;
}

// TODO: is "module" a reserved word in node.js? is it safe to use? if scoped?
// TODO: parent scope
// TODO: multiple variable definitions
function findModule(callExpression, scope) {
  var module;

  if (callExpression.callee.object.type === 'CallExpression') {

    return findModule(callExpression.callee.object, scope);

  } else if (callExpression.callee.object.type === 'Identifier') {

    if (callExpression.callee.property.name === 'module' &&
        callExpression.callee.object.name === 'angular'
    ) {

      module = callExpression.arguments[0].value;

    } else if (_.contains(TYPES, callExpression.callee.property.name)) {

      var varName = callExpression.callee.object.name;
      var variable = _.findWhere(scope.variables, { name: varName });
      if (variable) {

        var varNode = _.first(variable.defs).node;
        module = varNode.init.arguments[0].value;

      }

    }

  }

  return module;
}

// TODO: parent scope
// TODO: multiple variable definitions
function findDeps(callExpression, scope) {
  var deps = [];

  var depsArg = callExpression.arguments[1] || {};

  if (depsArg.type === 'ArrayExpression') {

    depsArg = _.last(depsArg.elements) || {};

  } else if (depsArg.type === 'Identifier') {

    var varName = depsArg.name;
    var variable = _.findWhere(scope.variables, { name: varName });

    if (variable) {

      var varNode = _.first(variable.defs).node;

      var params = [];
      if (varNode.type === 'FunctionDeclaration') {
        params = varNode.params;
      } else if (varNode.type === 'VariableDeclarator') {
        params = varNode.init.params;
      }

      params.forEach(function (param) {
        if (param.type === 'Identifier') {
          deps.push(param.name);
        }
      });

    }

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