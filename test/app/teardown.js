'use strict';

var _ = require('lodash');
var fs = require('fs-extra');
var path = require('path');

var outputDir = path.join('test', 'app', 'test');
var searchExt = '.spec.js';

fs.readdir(outputDir, function (err, files) {
  if (err) { throw err; }

  _.forEach(files, function (file) {
    if (file.indexOf(searchExt) === file.length - searchExt.length) {
      var outputPath = path.join(outputDir, file);
      fs.removeSync(outputPath);
    }
  });

});