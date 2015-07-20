'use strict';

var fs = require('fs');

var cachePath = __dirname + '/../test/cache.json';

function cache(deps) {

  var data = '';

  if (fs.existsSync(cachePath)) {
    data = JSON.parse(fs.readFileSync(cachePath).toString());

    data = data.concat(deps);

    data = JSON.stringify(data);

  } else {
    data = JSON.stringify(deps);
  }

  fs.appendFileSync(cachePath, data, { flag: 'w' });
}

module.exports = cache;