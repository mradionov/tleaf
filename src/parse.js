'use strict';

var esprima = require('esprima'),
    estraverse = require('estraverse'),
    escope = require('escope'),
    _ = require('lodash');

var TYPES = [
  'controller',
  'service'
];


function parse(source) {

  // TODO: can throw exceptions because of bad code
  // consider re-throwing it, do not use promises or callbacks, keep it sync
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

    units.unshift({
      name: findName(call.node, call.scope),
      type: findType(call.node, call.scope),
      module: findModule(call.node, call.scope),
      deps: findDeps(call.node, call.scope)
    });

  });

  return units;
}

function findName(callExpression) {
  var name;

  var nameArg = callExpression.arguments[0] || {};
  if (nameArg.type === 'Literal') {
    name = nameArg.value;
  }

  return name;
}

function findType(callExpression) {
  return callExpression.callee.property.name;
}

// TODO: is "module" a reserved word in node.js? is it safe to use? if scoped?
// TODO: multiple variable definitions
function findModule(callExpression, scope) {
  var module = {
    name: ''
  };

  if (callExpression.callee.object.type === 'CallExpression') {

    return findModule(callExpression.callee.object, scope);

  } else if (callExpression.callee.object.type === 'Identifier') {

    if (callExpression.callee.property.name === 'module' &&
        callExpression.callee.object.name === 'angular'
    ) {

      module.name = callExpression.arguments[0].value;

    } else if (_.contains(TYPES, callExpression.callee.property.name)) {

      var varName = callExpression.callee.object.name;
      var variable;
      var currentScope = scope;

      while (!variable && currentScope) {
        variable = _.findWhere(currentScope.variables, { name: varName });
        currentScope = currentScope.upper;
      }

      if (variable) {
        var varNode = _.first(variable.defs).node;
        module.name = varNode.init.arguments[0].value;
      }

    }

  }

  return module;
}

// TODO: multiple variable definitions
function findDeps(callExpression, scope) {
  var deps = [];

  var depsArg = callExpression.arguments[1] || {};

  if (depsArg.type === 'ArrayExpression') {

    depsArg = _.last(depsArg.elements) || {};

  } else if (depsArg.type === 'Identifier') {

    var varName = depsArg.name;
    var variable;
    var currentScope = scope;

    while (!variable && currentScope) {
      variable = _.findWhere(currentScope.variables, { name: varName });
      currentScope = currentScope.upper;
    }

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
          deps.push({
            name: param.name
          });
        }
      });

    }

  }

  if (depsArg.type === 'FunctionExpression') {
    depsArg.params.forEach(function (param) {
      if (param.type === 'Identifier') {
        deps.push({
          name: param.name
        });
      }
    });
  }

  return deps;
}

module.exports = parse;