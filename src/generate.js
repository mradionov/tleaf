'use strict';

var handlebars = require('handlebars');

function generate(source, data) {

  var template = handlebars.compile(source);

  var result = template(data);

  return result;
}

module.exports = generate;