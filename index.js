'use strict';

var fs = require('fs');

var parse = require('./src/parse.js'),
    generate = require('./src/generate.js');

var targetPath = './test/sources/controller1.js';
var templatePath = './src/templates/controller.tpl.js';
var testPath = './test/output/controller1.spec.js';

fs.readFile(targetPath, function (err, targetSource) {
  if (err) { throw err; }

  var result = parse(targetSource.toString());

  if (!result.controllers.length) {
    console.warn('No controllers found');
    return;
  }

  var controller = result.controllers[0];
  var module = result.modules[0];

  var deps = controller.deps;

  deps = deps.map(function (dep) {
    if (dep === '$scope') {
      return false;
    }
    if (dep === '$state') {
      return {
        name: dep,
        type: 'provider'
      };
    }
    if (dep === 'MyService1') {
      return {
        name: dep,
        type: 'service'
      };
    }
    if (dep == 'MyService2') {
      return {
        name: dep,
        type: 'service'
      };
    }
  }).filter(function (n) { return n; });

  var data = {
    unit: {
      name: controller.name,
      module: module,
      deps: deps
    }
  };

  fs.readFile(templatePath, function (err, templateSource) {
    if (err) { throw err; }

    var testSource = generate('controller', templateSource.toString(), data);

    fs.writeFile(testPath, testSource, function (err) {
      if (err) { throw err; }
    });

  });

});