const transform = require('lodash/transform');
const isEqual = require('lodash/isEqual');
const isObject = require('lodash/isObject');

const deepDiffrence = (object, base) => {
  const changes = (object, base) => (
    transform(object, function(result, value, key) {
      if (!isEqual(value, base[key])) {
        result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
      }
    })
  );

  return changes(object, base);
};
