'use strict';

var _ = require('lodash');

_.mixin({
  sortByKeys: sortByKeys
});

module.exports = _;

////////

function sortByKeys(array, keys, path) {
  var copy = array.slice();

  copy.sort(function (itemA, itemB) {
    var indexA = keys.indexOf(_.get(itemA, path)),
        indexB = keys.indexOf(_.get(itemB, path));
    if (indexA > indexB) { return 1; }
    if (indexA < indexB) { return -1; }
    return 0;
  });

  return copy;
}