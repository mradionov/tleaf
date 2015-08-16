'use strict';

var fs = require('fs-extra');
var _ = require('lodash'),
    Q = require('q');

var cachePath = __dirname + '/../test/cache.json';

////////

var cache = module.exports = {};

// store cache in memory for current run
var data;

////////

cache.set = function (path, value) {
  return load().then(function (data) {
    _.set(data, path, value);
    return save(data);
  });
};

cache.get = function (path, defaultValue) {
  return load().then(function (data) {
    var value = _.get(data, path);
    return _.isUndefined(value) ? defaultValue : value;
  });
};

////////

function load() {
  var deferred = Q.defer();
  if (data) {
    return deferred.resolve(data).promise;
  }

  return Q.nfcall(fs.exists, cachePath).then(function (exists) {
    if (!exists) {
      return {};
    }
    return Q.nfcall(fs.readFile, cachePath, 'utf8').then(function (serialized) {
      var obj = {};
      try {
        obj = JSON.parse(serialized);
      } catch (e) {}
      return obj;
    });
  });
}

function save(obj) {
  var serialized = '';
  try {
    serialized = JSON.stringify(obj);
  } catch (e) {}
  return Q.nfcall(fs.appendFile, cachePath, serialized, { flag: 'w' });
}