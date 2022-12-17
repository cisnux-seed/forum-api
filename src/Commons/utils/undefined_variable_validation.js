// to avoid program throw an incomplete properties error,
// when properties are complete but there is a property equal to false
const isUndefined = (item) => typeof item === 'undefined' || item === null;

module.exports = isUndefined;
