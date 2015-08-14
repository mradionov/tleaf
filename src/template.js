'use strict';

var fs = require('fs'),
    path = require('path');

var cache = require('./cache');

////////

var template = module.exports = {};

var defaultExt = '.tpl.js';
var defaultsDir = path.join('src', 'defaults');

////////

template.unit = function (type) {
  return load(type, path.join('templates'));
};


template.provider = function (type) {
  return load(type, path.join('templates', 'providers'));
};

////////

function load(type, relativePath) {

  var fileName = type + defaultExt;

  var templatePath = path.join(defaultsDir, relativePath, fileName);

  var usePath = cache.get('useConfig');
  if (usePath) {

    var useDir = path.dirname(usePath);
    var useTemplatePath = path.join(useDir, relativePath, fileName);

    if (fs.existsSync(useTemplatePath)) {
      templatePath = useTemplatePath;
    } else {
      console.error('Custom template is missing for type "%s"', type);
      console.error('Falling back default template');
    }
  }

  return fs.readFileSync(templatePath, 'utf8');
}