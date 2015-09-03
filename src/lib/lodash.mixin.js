'use strict';

var _ = require('lodash');

_.mixin({
  sortByKeys: sortByKeys
});

module.exports = _;

////////

function sortByKeys(array, keys, path) {
  if (!_.isArray(array) ||
      !_.isArray(keys) ||
      _.isEmpty(keys) ||
      _.isEmpty(path)
  ) { return array; }

  var copy = array.slice();

  copy.sort(function (itemA, itemB) {
    // -1   - a comes first
    // 1    - b comes first
    // 0    - as is
    var indexA = keys.indexOf(_.get(itemA, path)),
        indexB = keys.indexOf(_.get(itemB, path));

    if (indexA === -1) { return 1; }
    if (indexB === -1) { return -1; }
    if (indexA > indexB) { return 1; }
    if (indexA < indexB) { return -1; }
    return 0;
  });

  return copy;
}