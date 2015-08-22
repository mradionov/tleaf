'use strict';

var Handlebars = require('handlebars'),
    _ = require('lodash');

var config = require('../config'),
    template = require('../template');

var helpers = require('./helpers');

////////

module.exports = render;

////////

// TODO: custom helpers in config
// TODO: support coffee templates
function render(source, data) {
  registerPartials();
  registerHelpers();

  var compiledTemplate = Handlebars.compile(source, {
    noEscape: true
  });
  var result = compiledTemplate(data);

  var indent = config.indent;
  if (_.isNumber(indent)) {
    indent = _.repeat(' ', indent);
  }

  if (indent !== '\t') {
    result = result.replace(/\t/g, indent);
  }

  return result;
}

////////


// TODO: custom helpers from config
function registerHelpers() {
  _.forEach(helpers, function (fn, name) {
    Handlebars.registerHelper(name, fn);
  });
}


function registerPartials() {
  _.forEach(config.processedProviders, function (name) {
    var source = template.provider(name);
    Handlebars.registerPartial(name, source);
  });
}