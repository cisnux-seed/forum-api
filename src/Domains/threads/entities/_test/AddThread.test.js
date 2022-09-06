const AddThread = require('../AddThread');

describe('a AddThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      body: 'a body',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 123,
      title: true,
      body: 2.8,
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when owner contains more than 50 character', () => {
    // Arrange
    const payload = {
      owner: 'user-12345678901234567890123456789012345678901234567890123',
      title: 'a thread',
      body: 'a body',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.OWNER_LIMIT_CHAR');
  });

  it('should throw error when owner is empty', () => {
    // Arrange
    const payload = {
      owner: '           ',
      title: 'a title',
      body: 'a body',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.EMPTY_OWNER');
  });

  it('should throw error when title is empty', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      title: '  ',
      body: 'a body',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.EMPTY_TITLE');
  });

  it('should throw error when body is empty', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      title: 'a title',
      body: '      ',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.EMPTY_BODY');
  });

  it('should create AddThread object correctly', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      title: 'a thread',
      body: 'a body',
    };

    // Action
    const { owner, title, body } = new AddThread(payload);

    // Assert
    expect(owner).toEqual(payload.owner);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
