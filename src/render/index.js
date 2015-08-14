'use strict';

var Handlebars = require('handlebars'),
    _ = require('lodash');

var config = require('../config'),
    template = require('../template');

var helpers = require('./helpers');

////////

module.exports = render;

registerHelpers();
registerPartials();

////////

// TODO: order by type
// TODO: generate helper properties
// TODO: support coffee templates
function render(source, data) {

  var configOptions = _.pick(config, 'indent');
  var options = _.defaults(configOptions, {
    indent: '\t'
  });

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


function registerPartials() {
  _.forEach(config.processedProviders, function (provider) {
    var source = template.provider(provider);
    Handlebars.registerPartial(provider, source);
  });
}