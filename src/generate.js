'use strict';

var nunjucks = require('nunjucks');

// https://github.com/mozilla/nunjucks/issues/429
nunjucks.configure({ watch: false });

var env = new nunjucks.Environment();

env.addFilter('pluck', function (arr, prop) {
  return arr.map(function (item) {
    return item[prop];
  });
});

env.addFilter('toarg', function (arr, leading, wrapper, delimeter) {
  if (!arr.length) { return ''; }
  var wr = wrapper || '', dl = delimeter || ', ';
  return (leading ? dl : '') + arr.map(function (item) {
    return wr + item + wr;
  }).join(dl);
});

// TODO: order by type
// TODO: generate helper properties
// TODO: inject config
// TODO: try to simplify templates to remove logic completely
function generate(template, unit) {

  var model = {
    unit: unit
  };

  var result = env.renderString(template, model);

  return result;
}

module.exports = generate;