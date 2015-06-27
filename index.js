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


  var data = {
    unit: {
      name: controller.name
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