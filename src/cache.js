'use strict';

var fs = require('fs-extra'),
    path = require('path');

var _ = require('lodash');

////////

var cache = module.exports = {};

// store cache in memory for current run
var tmp;

////////

// TODO: namespace keys depending on node installation?

cache.set = function (path, value) {
  var data = load();
  _.set(data, path, value);
  save(data);
};

cache.get = function (path, defaultValue) {
  var data = load();
  var value = _.get(data, path);
  return _.isUndefined(value) ? defaultValue : value;
};

cache.remove = function (path) {
  var data = load();

  var parts = path.split('.');
  if (parts.length > 1) {

    var key = parts.pop();
    var parentPath = parts.join('.');
    var parent = _.get(data, parentPath);

    delete parent[key];

  } else {

    delete data[path];

  }

  save(data);
};

// TODO: check on windows
cache.path = function () {
  var homePath = process.env.HOME;
  if (process.platform === 'win32') {
    homePath = process.env.USERPROFILE;
  }

  var cacheDirName = '.tleaf';
  var cacheFileName = 'cache.json';
  var cachePath = path.join(homePath, cacheDirName, cacheFileName);

  return cachePath;
};

////////

function load() {
  if (tmp) {
    return tmp;
  }

  var serialized = '';
  try {
    serialized = fs.readFileSync(cache.path(), 'utf8');
  } catch(err) {
    // it's fine if cache file does not exist, it will be created on save
    if (err.code !== 'ENOENT') {
      throw new Error(err);
    }
  }

  var data = {};
  try {
    data = JSON.parse(serialized);
  } catch (err) {}

  tmp = data;

  return data;
}

function save(data) {
  var serialized = '';
  try {
    serialized = JSON.stringify(data);
  } catch (err) {}

  tmp = data;

  var cachePath = cache.path();
  var cacheDir = path.dirname(cachePath);

  fs.mkdirsSync(cacheDir);
  fs.writeFileSync(cachePath, serialized, 'utf8');
}