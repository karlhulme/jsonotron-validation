/**
 * Returns a function that examines a data argument and determines
 * whether it is an acceptable type given the keyword value.
 * @param {Object} keywordValue The value ('object', 'string', ['object', 'function'] etc) supplied
 * to the keyword property in the schema.
 * @param {Object} parentSchema The parent schema.
 */
function customTypeOfValidatorGenerator (keywordValue, parentSchema) {
  if (Array.isArray(keywordValue)) {
    return data => keywordValue.includes(typeof data)
  } else {
    return data => String(typeof data) === keywordValue
  }
}

module.exports = customTypeOfValidatorGenerator
