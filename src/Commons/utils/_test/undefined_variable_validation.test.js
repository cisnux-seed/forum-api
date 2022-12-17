const isUndefined = require('../undefined_variable_validation');

describe('Undefined Validation', () => {
  it('should be true when the value is undefined', () => {
    // arrange
    let aValue;

    // act and assert
    expect(isUndefined(aValue)).toEqual(true);
  });

  it('should be false when the value is undefined', () => {
    // arrange
    const aValue = 'a data';

    // act and assert
    expect(isUndefined(aValue)).toEqual(false);
  });
});
