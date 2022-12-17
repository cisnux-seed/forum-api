const DeleteComment = require('../DeleteComment');

describe('a DeleteComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 2.8,
      threadId: 123,
      owner: true,
    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when id is empty', () => {
    // Arrange
    const payload = {
      id: '           ',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.EMPTY_ID');
  });

  it('should throw error when thread id is empty', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      threadId: '   ',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.EMPTY_THREAD_ID');
  });

  it('should throw error when owner is empty', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      threadId: 'thread-123',
      owner: '       ',
    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.EMPTY_OWNER');
  });

  it('should create DeleteComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action
    const { id, owner, threadId } = new DeleteComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
    expect(threadId).toEqual(payload.threadId);
  });
});
