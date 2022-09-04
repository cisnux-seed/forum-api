const AddReply = require('../AddReply');

describe('an AddReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
      content: null,
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 30,
      commentId: true,
      owner: [],
      content: false,
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when threadId contains more than 50 character', () => {
    // Arrange
    const payload = {
      threadId: 'thread-12345678901234567890123456789012345678901234567890123',
      commentId: 'comment-123',
      owner: 'user-123',
      content: 'a content',
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.THREAD_ID_LIMIT_CHAR');
  });

  it('should throw error when commentId contains more than 50 character', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-12345678901234567890123456789012345678901234567890123',
      owner: 'user-123',
      content: 'a content',
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.COMMENT_ID_LIMIT_CHAR');
  });

  it('should throw error when owner contains more than 50 character', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-12345678901234567890123456789012345678901234567890123',
      content: 'a content',
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.OWNER_LIMIT_CHAR');
  });

  it('should throw error when owner is empty', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: ' ',
      commentId: 'comment-123',
      content: 'a content',
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.EMPTY_OWNER');
  });

  it('should throw error when threadId is empty', () => {
    // Arrange
    const payload = {
      threadId: '       ',
      owner: 'user-123',
      commentId: 'comment-123',
      content: 'a content',
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.EMPTY_THREAD_ID');
  });

  it('should throw error when commentId is empty', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
      commentId: '     ',
      content: 'a content',
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.EMPTY_COMMENT_ID');
  });

  it('should throw error when content is empty', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
      commentId: 'comment-123',
      content: '       ',
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.EMPTY_CONTENT');
  });

  it('should create AddReply object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
      commentId: 'comment-123',
      content: 'a content',
    };

    // Action
    const {
      threadId,
      owner,
      commentId,
      content,
    } = new AddReply(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
    expect(commentId).toEqual(payload.commentId);
    expect(content).toEqual(payload.content);
  });
});
