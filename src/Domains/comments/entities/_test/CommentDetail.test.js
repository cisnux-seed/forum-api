const CommentDetail = require('../CommentDetail');

describe('a CommentDetail entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'chat-123',
      content: 'a content',
      date: '2020-01-01T00:00:00Z',
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 2.1,
      content: 123,
      date: [],
      username: false,
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CommentDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'chat-123',
      content: 'a content',
      date: '2020-01-01T00:00:00Z',
      username: 'user123',
    };

    // Action
    const {
      id, content, date, username,
    } = new CommentDetail(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });

  describe('fromTable function', () => {
    it('should return CommentDetail correctly when content has been deleted', () => {
      // Arrange
      const payload = {
        id: 'chat-123',
        content: 'a content',
        date: '2020-01-01T00:00:00Z',
        username: 'user123',
        isDelete: true,
      };

      // Action
      const {
        id, content, date, username,
      } = CommentDetail.fromTable(payload);

      // Assert
      expect(id).toEqual(payload.id);
      expect(content).toEqual('**balasan telah dihapus**');
      expect(date).toEqual(payload.date);
      expect(username).toEqual(payload.username);
    });

    it('should return CommentDetail correctly when content has not been deleted', () => {
      // Arrange
      const payload = {
        id: 'chat-123',
        content: 'a content',
        date: '2020-01-01T00:00:00Z',
        username: 'user123',
        isDelete: false,
      };

      // Action
      const {
        id, content, date, username,
      } = CommentDetail.fromTable(payload);

      // Assert
      expect(id).toEqual(payload.id);
      expect(content).toEqual(payload.content);
      expect(date).toEqual(payload.date);
      expect(username).toEqual(payload.username);
    });
  });
});
