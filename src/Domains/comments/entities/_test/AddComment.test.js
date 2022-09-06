const AddComment = require('../AddComment');

describe('an AddComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      owner: true,
      content: 2.8,
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when threadId contains more than 50 character', () => {
    // Arrange
    const payload = {
      threadId: 'thread-12345678901234567890123456789012345678901234567890123',
      owner: 'user-123',
      content: 'a content',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.THREAD_ID_LIMIT_CHAR');
  });

  it('should throw error when owner contains more than 50 character', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: 'user-12345678901234567890123456789012345678901234567890123',
      content: 'a content',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.OWNER_LIMIT_CHAR');
  });

  it('should throw error when owner is empty', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: ' ',
      content: 'a content',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.EMPTY_OWNER');
  });

  it('should throw error when threadId is empty', () => {
    // Arrange
    const payload = {
      threadId: '       ',
      owner: 'user-123',
      content: 'a content',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.EMPTY_THREAD_ID');
  });

  it('should throw error when content is empty', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
      content: '       ',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.EMPTY_CONTENT');
  });

  it('should create AddComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
      content: 'a content',
    };

    // Action
    const { owner, threadId, content } = new AddComment(payload);

    // Assert
    expect(owner).toEqual(payload.owner);
    expect(threadId).toEqual(payload.threadId);
    expect(content).toEqual(payload.content);
  });
});
