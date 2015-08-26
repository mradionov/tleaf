'use strict';

var esprima = require('esprima'),
    estraverse = require('estraverse'),
    escope = require('escope'),
    _ = require('lodash');

var config = require('./config'),
    log = require('./log');

////////

module.exports = parse;

////////


function parse(source) {

  // TODO: can throw exceptions because of bad code
  // consider re-throwing it, do not use promises or callbacks, keep it sync

  var ast;
  try {
    ast = esprima.parse(source);
  } catch (err) {
    log('Source file is not valid');
    log.pure('Error: %s', err.message);
    throw err;
  }

  var scopeManager = escope.analyze(ast);

  // global scope
  var currentScope = scopeManager.acquire(ast);

  var calls = [];

  estraverse.traverse(ast, {
    enter: function (node) {

      if (node.type === 'CallExpression') {

        var type = _.get(node, 'callee.property.name');
        if (_.contains(config.units.process, type)) {
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
    // deps depend on type
    var type = findType(call.node, call.scope);
    var module = findModule(call.node, call.scope);

    // unit must have a module, otherwise it can be a simple function call
    // which has the same name as some unit type
    if (_.isUndefined(module.name)) {
      return;
    }

    var unit = {
      name: findName(call.node, call.scope),
      type: type,
      module: module,
      deps: findDeps(call.node, call.scope, type)
    };

    units.unshift(unit);
  });

  return units;
}


////////


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
  var module = {};

  if (callExpression.callee.object.type === 'CallExpression') {

    return findModule(callExpression.callee.object, scope);

  } else if (callExpression.callee.object.type === 'Identifier') {

    if (callExpression.callee.property.name === 'module' &&
        callExpression.callee.object.name === 'angular'
    ) {

      module.name = callExpression.arguments[0].value;

    } else if (_.contains(config.units.process, callExpression.callee.property.name)) {

      var varName = callExpression.callee.object.name;
      var varNode = findVariable(varName, scope);
      if (varNode) {
        module.name = varNode.init.arguments[0].value;
      }

    }

  }

  return module;
}


// TODO: multiple variable definitions
function findDeps(callExpression, scope, type) {

  var deps = [];
  var cantHaveDeps = ['filter', 'value', 'constant'];

  // filter can't have dependenices
  if (_.contains(cantHaveDeps, type)) {
    return [];
  }

  var depsArg = callExpression.arguments[1] || {};

  //

  if (depsArg.type === 'ArrayExpression') {

    depsArg = _.last(depsArg.elements) || {};

    if (depsArg.type === 'FunctionExpression') {
      deps = extractDeps(depsArg.params);
      return deps;
    }

  }

  //

  if (depsArg.type === 'Identifier') {

    var varName = depsArg.name;

    deps = extractVariableDeps(varName, scope);

    return deps;
  }

  //

  if (depsArg.type === 'FunctionExpression') {

    if (type !== 'provider') {
      deps = extractDeps(depsArg.params);
      return deps;
    }

    if (depsArg.body.type === 'BlockStatement') {
      var bodyExpressions = depsArg.body.body;

      // debugger;

      bodyExpressions.some(function (bodyExpression) {

        if (bodyExpression.type === 'ExpressionStatement' &&
            bodyExpression.expression.left.property.name === '$get'
        ) {

          if (bodyExpression.expression.right.type === 'FunctionExpression') {
            deps = extractDeps(bodyExpression.expression.right.params);
            return true;
          }

          if (bodyExpression.expression.right.type === 'Identifier') {

            var varName = bodyExpression.expression.right.name;
            var blockScope = findScope(depsArg);

            deps = extractVariableDeps(varName, blockScope);
            return true;
          }

        } else if (bodyExpression.type === 'ReturnStatement') {

          if (bodyExpression.argument.type === 'ObjectExpression') {
            var properties = bodyExpression.argument.properties;
            var fn = _.find(properties, function (property) {
              return property.key.name === '$get';
            });

            if (fn) {
              if (fn.value.type === 'FunctionExpression') {

                deps = extractDeps(fn.value.params);
                return true;

              } else if (fn.value.type === 'Identifier') {

                var varName = fn.value.name;
                var blockScope = findScope(depsArg);

                deps = extractVariableDeps(varName, blockScope);

                return true;
              }
            }

          } else if (bodyExpression.argument.type === 'Identifier') {

            var varName = bodyExpression.argument.name;
            var blockScope = findScope(depsArg);

            var varNode = findVariable(varName, blockScope);
            if (varNode) {

              if (varNode.init.type === 'ObjectExpression') {
                var properties = varNode.init.properties;
                var fn = _.find(properties, function (property) {
                  return property.key.name === '$get';
                });

                if (fn && fn.value.type === 'FunctionExpression') {
                  deps = extractDeps(fn.value.params);
                  return true;
                }

              }

            }

          }

        }

      });

      return deps;
    }

  }

  return deps;
}


function extractDeps(params) {
  var deps = [];

  params.forEach(function (param) {
    if (param.type === 'Identifier') {

      var dep = {
        name: param.name
      };

      deps.push(dep);
    }
  });

  return deps;
}


function findVariable(varName, scope) {

  var variable;
  var currentScope = scope;

  while (!variable && currentScope) {
    variable = _.findWhere(currentScope.variables, { name: varName });
    currentScope = currentScope.upper;
  }

  if (!variable) {
    return void 0;
  }

  var node = _.first(variable.defs).node;

  return node;
}


function extractVariableDeps(varName, scope) {

  var varNode = findVariable(varName, scope);
  if (!varNode) {
    return [];
  }

  var params = [];

  if (varNode.type === 'FunctionDeclaration') {
    params = varNode.params;
  } else if (varNode.type === 'VariableDeclarator') {
    params = varNode.init.params;
  }

  var deps = extractDeps(params);

  return deps;
}


function findScope(ast) {
  var scopeManager = escope.analyze(ast);
  var scope = scopeManager.acquire(ast);
  return scope;
}