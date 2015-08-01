'use strict';

var nunjucks = require('nunjucks');
var _ = require('lodash');

// https://github.com/mozilla/nunjucks/issues/429
nunjucks.configure({ watch: false });

var env = new nunjucks.Environment();

function joined(array, delimiter) {
  delimiter = delimiter || ', ';
  return array.join(delimiter);
}

function ljoined(array, delimiter) {
  if (!array.length) { return ''; }
  var copy = array.slice();
  copy.unshift('');
  return joined(copy, delimiter);
}

function dashCase(string) {
  return _.snakeCase(string).replace(/_/g, '-');
}

env.addFilter('joined', joined);
env.addFilter('ljoined', ljoined);
env.addFilter('dashCase', dashCase);

// TODO: order by type
// TODO: generate helper properties
// TODO: inject config
// TODO: try to simplify templates to remove logic completely
// TODO: support coffee templates
function generate(template, data) {

  var result = env.renderString(template, data);

  return result;
}

module.exports = generate;