const CommentLike = require('../CommentLike');

describe('a CommentLike entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      threadId: 'thread-123',
    };

    // Action and Assert
    expect(() => new CommentLike(payload)).toThrowError('COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 2.8,
      threadId: [],
      userId: true,
    };

    // Action and Assert
    expect(() => new CommentLike(payload)).toThrowError('COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when id is empty', () => {
    // Arrange
    const payload = {
      id: '           ',
      threadId: 'thread-123',
      userId: 'user-123',
    };

    // Action and Assert
    expect(() => new CommentLike(payload)).toThrowError('COMMENT_LIKE.EMPTY_ID');
  });

  it('should throw error when thread id is empty', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      threadId: '      ',
      userId: 'user-123',
    };

    // Action and Assert
    expect(() => new CommentLike(payload)).toThrowError('COMMENT_LIKE.EMPTY_THREAD_ID');
  });

  it('should throw error when user id is empty', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      threadId: 'thread-123',
      userId: '       ',
    };

    // Action and Assert
    expect(() => new CommentLike(payload)).toThrowError('COMMENT_LIKE.EMPTY_USER_ID');
  });

  it('should create CommentLike object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      threadId: 'thread-123',
      userId: 'user-123',
    };

    // Action
    const { id, threadId, userId } = new CommentLike(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(threadId).toEqual(payload.threadId);
    expect(userId).toEqual(payload.userId);
  });
});
