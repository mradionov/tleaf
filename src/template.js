'use strict';

var fs = require('fs-extra');
var path = require('path');

var C = require('./constants');
var cache = require('./cache');
var config = require('./config');
var UserError = require('./error/UserError');

////////

var template = module.exports = {};

////////

template.unit = function (type) {
  return load(type, path.join('templates'));
};


template.dependency = function (type) {
  var mappedType = config.dependencies.templateMap[type] || type;
  return load(mappedType, path.join('templates', 'dependencies'));
};

////////

function load(type, relativePath) {

  var fileName = type + C.TEMPLATE_EXT;
  var defaultsDir = path.join(__dirname, 'defaults');

  var templatePath = path.join(defaultsDir, relativePath, fileName);

  var usePath = cache.get(C.CACHE_USE_CONFIG_KEY);
  if (usePath) {

    var useDir = path.dirname(usePath);
    var useTemplatePath = path.join(useDir, relativePath, fileName);

    if (fs.existsSync(useTemplatePath)) {
      templatePath = useTemplatePath;
    }
  }

  var templateSource = '';

  try {
    templateSource = fs.readFileSync(templatePath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new UserError('Template file not found.');
    }
    if (err.code === 'EACCES') {
      throw new UserError('Not enough permissions to access template file.');
    }
  }

  return templateSource;
}