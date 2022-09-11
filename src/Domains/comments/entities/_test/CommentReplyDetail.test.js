const CommentDetail = require('../CommentDetail');
const CommentReplyDetail = require('../CommentReplyDetail');

describe('a CommentReplyDetail entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'chat-123',
      content: 'a content',
      date: '2020-01-01T00:00:00Z',
      username: 'user123',
      replies: [],
    };

    // Action and Assert
    expect(() => new CommentReplyDetail(payload)).toThrowError('COMMENT_REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 2.1,
      content: true,
      date: false,
      username: 'user123',
      replies: 23,
      likeCount: false,
    };

    // Action and Assert
    expect(() => new CommentReplyDetail(payload)).toThrowError('COMMENT_REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CommentReplyDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'chat-123',
      content: 'a content',
      username: 'user123',
      date: '2020-01-01T00:00:00Z',
      replies: [
        new CommentDetail({
          id: 'reply-123',
          content: 'a content',
          date: '2020-02-01T00:00:00Z',
          username: 'user127',
        }),
      ],
      likeCount: '21',
    };

    // Action
    const {
      id,
      username,
      content,
      date,
      replies,
      likeCount,
    } = new CommentReplyDetail(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(replies).toEqual(payload.replies);
    expect(likeCount).toEqual(payload.likeCount);
  });

  describe('fromTable function', () => {
    it('should return CommentReplyDetail object correctly when content has been deleted', () => {
      // Arrange
      const payload = {
        id: 'chat-123',
        content: 'a content',
        username: 'user123',
        date: '2020-01-01T00:00:00Z',
        isDelete: true,
        replies: [
          {
            id: 'reply-123',
            content: 'a content',
            date: '2020-02-01T00:00:00Z',
            username: 'user127',
          },
        ],
        likeCount: '21',
      };

      // Action
      const {
        id,
        username,
        content,
        date,
        replies,
        likeCount,
      } = CommentReplyDetail.fromTable(payload);

      // Assert
      expect(id).toEqual(payload.id);
      expect(username).toEqual(payload.username);
      expect(content).toEqual('**komentar telah dihapus**');
      expect(date).toEqual(payload.date);
      expect(replies).toEqual(payload.replies);
      expect(likeCount).toEqual(payload.likeCount);
    });

    it('should return CommentReplyDetail object correctly has not been deleted', () => {
      // Arrange
      const payload = {
        id: 'chat-123',
        content: 'a content',
        username: 'user123',
        date: '2020-01-01T00:00:00Z',
        replies: [
          {
            id: 'reply-123',
            content: 'a content',
            date: '2020-02-01T00:00:00Z',
            username: 'user127',
          },
        ],
        likeCount: '21',
      };

      // Action
      const {
        id,
        username,
        content,
        date,
        replies,
        likeCount,
      } = CommentReplyDetail.fromTable(payload);

      // Assert
      expect(id).toEqual(payload.id);
      expect(username).toEqual(payload.username);
      expect(content).toEqual(payload.content);
      expect(date).toEqual(payload.date);
      expect(replies).toEqual(payload.replies);
      expect(likeCount).toEqual(payload.likeCount);
    });

    it('should return CommentReplyDetail object with empty replies', () => {
      // Arrange
      const payload = {
        id: 'chat-123',
        content: 'a content',
        isDelete: false,
        username: 'user123',
        date: '2020-01-01T00:00:00Z',
        replies: null,
        likeCount: '21',
      };

      // Action
      const {
        id,
        username,
        content,
        date,
        replies,
        likeCount,
      } = CommentReplyDetail.fromTable(payload);

      // Assert
      expect(id).toEqual(payload.id);
      expect(username).toEqual(payload.username);
      expect(content).toEqual(payload.content);
      expect(date).toEqual(payload.date);
      expect(replies).toEqual([]);
      expect(likeCount).toEqual(payload.likeCount);
    });
  });
});
