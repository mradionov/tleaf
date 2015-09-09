'use strict';

var handlebars = require('handlebars');
var _ = require('lodash');

var config = require('../config');
var template = require('../template');

var helpers = require('./helpers');

////////

module.exports = render;

////////

// TODO: support coffee templates
function render(source, data) {
  var env = handlebars.create();

  registerPartials(env);
  registerHelpers(env);

  var compiledTemplate = env.compile(source, {
    noEscape: true
  });

  var result = compiledTemplate(data);

  var indent = config.template.indent;
  if (_.isNumber(indent)) {
    indent = _.repeat(' ', indent);
  }

  if (indent !== '\t') {
    result = result.replace(/\t/g, indent);
  }

  return result;
}

////////


// TODO: allow custom helpers in config
function registerHelpers(env) {
  _.forEach(helpers, function (fn, name) {
    env.registerHelper(name, fn);
  });
}


function registerPartials(env) {
  var partials = {};

  _.forEach(config.dependencies.process, function (name) {
    var source = template.dependency(name);
    partials[name] = source;
  });

  // Include it even if option is disabled, because partial is referenced
  // in templates anyway, but you'll get an error for missing partial
  // TODO: move it to file, if there will be more partials
  partials['useStrict'] = '';
  if (!!config.template.useStrict) {
    partials['useStrict'] = "'use strict';\n\n";
  }

  _.forEach(partials, function (source, name) {
    env.registerPartial(name, source);
  });
}