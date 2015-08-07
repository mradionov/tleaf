'use strict';

var fs = require('fs');
var _ = require('lodash');

var cachePath = __dirname + '/../test/cache.json';

var cache = {
  set: set,
  get: get
};

module.exports = cache;

////////

var data;

function set(path, value) {
  data = data || load();
  _.set(data, path, value);
  save(data);
}

function get(path, defaultValue) {
  data = data || load();
  var value = _.get(data, path);
  return _.isUndefined(value) ? defaultValue : value;
}

function load() {
  if (!fs.existsSync(cachePath)) {
    return {};
  }

  var serialized = fs.readFileSync(cachePath, 'utf8');
  var obj = JSON.parse(serialized);

  return obj;
}

function save(obj) {
  var serialized = JSON.stringify(obj);
  fs.appendFileSync(cachePath, serialized, { flag: 'w' });
}