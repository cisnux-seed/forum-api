const DeleteReply = require('../DeleteReply');

describe('a DeleteReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 2.8,
      commentId: [],
      threadId: 123,
      owner: true,
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when id is empty', () => {
    // Arrange
    const payload = {
      id: '           ',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.EMPTY_ID');
  });

  it('should throw error when comment id is empty', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      commentId: '   ',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.EMPTY_COMMENT_ID');
  });

  it('should throw error when thread id is empty', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      commentId: 'comment-123',
      threadId: '   ',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.EMPTY_THREAD_ID');
  });

  it('should throw error when owner is empty', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: '       ',
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.EMPTY_OWNER');
  });

  it('should create DeleteReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action
    const {
      id, commentId, threadId, owner,
    } = new DeleteReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(commentId).toEqual(payload.commentId);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
