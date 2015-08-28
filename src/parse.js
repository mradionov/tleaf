'use strict';

var esprima = require('esprima');
var estraverse = require('estraverse');
var escope = require('escope');
var _ = require('lodash');

var config = require('./config');
var UserError = require('./error/UserError');

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
    throw new UserError('Source file is not valid', err);
  }

  var scopeManager = escope.analyze(ast);

  // global scope
  var currentScope = scopeManager.acquire(ast);

  var calls = [];

  estraverse.traverse(ast, {
    enter: function (node) {
      // find all call expressions, because all angular unit types are
      // defined as function calls: .controller(), .service(), etc
      if (node.type === 'CallExpression') {

        var calleeProp = _.get(node, 'callee.property', {});

        if (_.contains(config.units.process, calleeProp.name)) {
          // save matching node with an appropriate scope
          calls.push({
            node: node,
            scope: currentScope
          });
        }

      }

      // update current scope while traversing
      // taken from original repository: https://github.com/estools/escope
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

  _.forEach(calls, function (call) {

    var module = findModule(call.node, call.scope);
    // unit must have a module, otherwise it can be a simple function call
    // which has the same name as some unit type
    if (_.isUndefined(module.name)) {
      return;
    }

    // deps depend on type, different unit types have deps defined differently
    var type = findType(call.node, call.scope);

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

  var nameArg = _.get(callExpression, 'arguments[0]', {});
  if (nameArg.type === 'Literal') {
    name = nameArg.value;
  }

  return name;
}


function findType(callExpression) {
  return _.get(callExpression, 'callee.property.name');
}


// TODO: is "module" a reserved word in node.js? is it safe to use? if scoped?
// TODO: multiple variable definitions
function findModule(callExpression, scope) {
  var module = {};

  var calleeObj = _.get(callExpression, 'callee.object', {}),
      calleeProp = _.get(callExpression, 'callee.property', {});

  if (calleeObj.type === 'CallExpression') {
    // recursive find module, usually when units are chained
    return findModule(calleeObj, scope);

  } else if (calleeObj.type === 'Identifier') {
    // when reaching module variable it can be in a form of "angular.module(..)"
    if (calleeProp.name === 'module' && calleeObj.name === 'angular') {

      module.name = _.get(callExpression, 'arguments[0].value');

    // or module can be stored in variable; find this variable then
    } else if (_.contains(config.units.process, calleeProp.name)) {

      var varName = calleeObj.name;
      var varNode = findVariable(varName, scope);
      if (varNode) {
        module.name = _.get(varNode, 'init.arguments[0].value');
      }

    }

  }

  return module;
}


// TODO: multiple variable definitions
function findDeps(callExpression, scope, type) {

  var cantHaveDeps = ['filter', 'value', 'constant'];
  if (_.contains(cantHaveDeps, type)) {
    return [];
  }

  // first argument is a name of the unit, second - usually has deps
  var depsArg = _.get(callExpression, 'arguments[1]', {});
  var deps = [];

  // deps can be provided explicitly as an array
  // in this case a body of the unit is the last array element
  if (depsArg.type === 'ArrayExpression') {
    var lastDepsArg = _.last(depsArg.elements) || {};
    if (lastDepsArg.type === 'FunctionExpression') {
      return extractDeps(lastDepsArg.params);
    }
  }

  // deps in a form of function expression can be stored in variable
  if (depsArg.type === 'Identifier') {
    return extractVariableDeps(depsArg.name, scope);
  }

  // deps in a form of function expression
  if (depsArg.type === 'FunctionExpression') {

    // everything except provider usually stores deps as function arguments
    if (type !== 'provider') {
      return extractDeps(depsArg.params);
    }

    // provider has a lot more complex structure because of $get construct
    // it may vary a lot, covering common cases
    return findProviderDeps(depsArg);
  }

  return deps;
}


function findProviderDeps(depsFn) {
  // function must have it's body
  var depsFnBody = _.get(depsFn, 'body', {});
  if (depsFnBody.type !== 'BlockStatement') {
    return [];
  }

  // find a scope of provider body
  var depsFnScope = findScope(depsFn);

  var deps = [];

  // iterate over all body expressions in provider
  var depsFnBodyExpressions = _.get(depsFnBody, 'body');
  _.some(depsFnBodyExpressions, function (bodyExpression) {

    var type = _.get(bodyExpression, 'type');

    var expression = _.get(bodyExpression, 'expression', {});
    var leftProp = _.get(expression, 'left.property', {});
    var right = _.get(expression, 'right', {});

    // covers "this.$get = ..."
    if (type === 'ExpressionStatement' && leftProp.name === '$get') {

      // covers "this.$get = function (...) { ... };"
      if (right.type === 'FunctionExpression') {
        deps = extractDeps(right.params);
        return true; // exit loop
      }

      // covert "this.$get = someVar;"
      if (right.type === 'Identifier') {
        deps = extractVariableDeps(right.name, depsFnScope);
        return true; // exit loop
      }

    }

    var argument = _.get(bodyExpression, 'argument', {});

    // covers "return ...;"
    if (type === 'ReturnStatement') {

      // covers "return { $get: function () {} };"
      // covers "return { $get: someVar };"
      if (argument.type === 'ObjectExpression') {
        deps = extractObjectPropertyDeps(argument, '$get', depsFnScope);
        return true;
      }

      // covers "return someVar;"
      if (argument.type === 'Identifier') {

        var varNode = findVariable(argument.name, depsFnScope);
        if (varNode && _.get(varNode, 'init.type') === 'ObjectExpression') {
          deps = extractObjectPropertyDeps(varNode.init, '$get', depsFnScope);
          return true;
        }

      }

    }

  });

  return deps;
}


function extractDeps(params) {
  if (!_.isArray(params)) {
    return [];
  }

  var deps = [];
  _.forEach(params, function (param) {
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

  if (_.isUndefined(variable)) {
    return variable;
  }

  var node = _.get(variable, 'defs[0].node');

  return node;
}


function extractVariableDeps(varName, scope) {
  var varNode = findVariable(varName, scope);
  if (!varNode) {
    return [];
  }

  var params = [];

  var varType = _.get(varNode, 'type');

  // covers "function someVar() {}"
  if (varType === 'FunctionDeclaration') {
    params = _.get(varNode, 'params', []);
  }

  // covers "var someVar = ...";
  if (varType === 'VariableDeclarator') {
    params = _.get(varNode, 'init.params', []);
  }

  var deps = extractDeps(params);

  return deps;
}

function extractObjectPropertyDeps(object, propName, scope) {

  var prop = _.find(object.properties, function (property) {
    return _.get(property, 'key.name') === propName;
  });

  if (!prop) {
    return [];
  }

  var value = _.get(prop, 'value', {});

  var deps = [];

  // covers "{ key: function () {} }"
  if (value.type === 'FunctionExpression') {
    deps = extractDeps(value.params);
  }

  // covers "{ key: someVar }"
  if (value.type === 'Identifier') {
    deps = extractVariableDeps(value.name, scope);
  }

  return deps;
}


function findScope(ast) {
  var scopeManager = escope.analyze(ast);
  var scope = scopeManager.acquire(ast);
  return scope;
}