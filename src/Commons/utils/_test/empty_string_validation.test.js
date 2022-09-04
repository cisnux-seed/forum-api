require('../empty_string_validation');

describe('empty string function', () => {
  it('should be false when string is not empty', () => {
    // arrange
    const string = 'user';
    // act and assert
    expect(string.isEmpty).toEqual(false);
  });

  it('should be true when string is empty', () => {
    // arrange
    const string = '    ';
    // act and assert
    expect(string.isEmpty).toEqual(true);
  });
});
