'use strict';

var fs = require('fs');

var Handlebars = require('handlebars');
var _ = require('lodash');

function join(array, delimiter) {
  return array.join(delimiter || ', ');
}

function leftJoin(array, delimiter) {
  if (!array.length) { return ''; }
  var copy = array.slice();
  copy.unshift('');
  return join(copy, delimiter);
}

function dashCase(string) {
  return _.snakeCase(string).replace(/_/g, '-');
}

function defaults(value, defaultValue) {
  return _.isUndefined(value) ? defaultValue: value;
}


var helpers = {
  and: function (array) { return leftJoin(array); },
  only: function (array) { return join(array); },
  dashCase: dashCase,
  defaults: defaults
};


_.forEach(helpers, function (fn, name) {
  Handlebars.registerHelper(name, fn);
});


var providers = ['constant', 'factory', 'service', 'value', 'provider'];

providers.forEach(function (provider) {
  var source = fs.readFileSync('./src/defaults/templates/providers/' + provider + '.tpl.js', 'utf8');
  Handlebars.registerPartial(provider, source);
});


// TODO: order by type
// TODO: generate helper properties
// TODO: inject config
// TODO: try to simplify templates to remove logic completely
// TODO: support coffee templates
function generate(source, data, options) {
  options = _.defaults(options || {}, {
    indent: '\t'
  });

  var template = Handlebars.compile(source, {
    noEscape: true
  });
  var result = template(data);

  var indent = options.indent;
  if (_.isNumber(options.indent)) {
    indent = _.repeat(' ', options.indent);
  }

  if (indent !== '\t') {
    result = result.replace(/\t/g, indent);
  }

  return result;
}

module.exports = generate;