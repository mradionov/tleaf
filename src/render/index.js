'use strict';

var Handlebars = require('handlebars'),
    _ = require('lodash');

var helpers = require('./helpers');

////////

module.exports = render;

////////

// TODO: custom helpers in config
// TODO: support coffee templates
function render(source, data, options) {
  options = _.defaults(options || {}, {
    indent: '\t',
    partials: []
  });

  registerPartials(options.partials);
  registerHelpers();

  var compiledTemplate = Handlebars.compile(source, {
    noEscape: true
  });
  var result = compiledTemplate(data);

  var indent = options.indent;
  if (_.isNumber(options.indent)) {
    indent = _.repeat(' ', options.indent);
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


function registerPartials(partials) {
  _.forEach(partials, function (source, name) {
    Handlebars.registerPartial(name, source);
  });
}