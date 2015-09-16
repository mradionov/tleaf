'use strict';

var fs = require('fs-extra');
var path = require('path');
var os = require('os');
var _ = require('lodash');
var basedir = require('xdg-basedir');

var C = require('./constants');
var UserError = require('./error/UserError');

////////

var cache = module.exports = {};

// store cache in memory for current run
var tmp;

////////

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

cache.path = function () {
  var basePath = basedir.cache || os.tempdir();
  var cachePath = path.join(basePath, C.CACHE_DIR_NAME, C.CACHE_FILE_NAME);
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

  try {
    fs.mkdirsSync(cacheDir);
    fs.writeFileSync(cachePath, serialized, 'utf8');
  } catch (err) {
    if (err.code === 'EACCES') {
      throw new UserError('Not enough permissions to write cache.', err);
    }
  }
}