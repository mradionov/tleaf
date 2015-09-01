'use strict';

var fs = require('fs');
var path = require('path');

var cache = require('./cache');
var config = require('./config');

////////

var template = module.exports = {};

var defaultExt = '.tpl.js';
var defaultsDir = path.join('src', 'defaults');

////////

template.unit = function (type) {
  return load(type, path.join('templates'));
};


template.provider = function (type) {
  var mappedType = config.dependencies.templateMap[type] || type;
  return load(mappedType, path.join('templates', 'dependencies'));
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
    }
  }

  return fs.readFileSync(templatePath, 'utf8');
}