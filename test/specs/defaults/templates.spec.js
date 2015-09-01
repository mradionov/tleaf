'use strict';

var assert = require('chai').assert;
var fs = require('fs');

function pathFor(relative) {
  return 'src/defaults/templates/' + relative + '.tpl.js';
}

describe('defaults/templates', function () {

  describe('tabs for indentation', function () {

    var paths = [
      'constant', 'controller', 'directive', 'factory',
      'filter', 'provider', 'service', 'value',
      'dependencies/constant', 'dependencies/factory', 'dependencies/provider',
      'dependencies/service', 'dependencies/value'
    ];

    paths.forEach(function (path) {

      it('should for ' + path, function (done) {
        fs.readFile(pathFor(path), 'utf8', function (err, source) {
          assert.isNull(err);
          assert.ok(source.indexOf('  ') < 0);
          done();
        });
      });

    });

  });

});