const CommentReplyDetail = require('../../../comments/entities/CommentReplyDetail');
const CommentDetail = require('../../../comments/entities/CommentDetail');
const ThreadDetail = require('../ThreadDetail');

describe('a ThreadDetail entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a body',
      date: '2020-01-01T00:00:00Z',
      username: 'user123',
    };

    // Action and Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: [],
      title: true,
      body: [],
      date: false,
      username: 8.1,
      comments: 223,
    };

    // Action and Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ThreadDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      title: 'a title',
      body: 'a body',
      date: '2020-01-01T00:00:00Z',
      username: 'user123',
      comments: [
        new CommentReplyDetail({
          id: 'comment-123',
          username: 'user123',
          content: 'a content',
          date: '2020-01-01T00:00:00Z',
          replies: [
            new CommentDetail({
              id: 'reply-127',
              username: 'user127',
              content: 'a content',
              date: '2020-04-01T00:00:00Z',
            }),
          ],
        }),
      ],
    };

    // Action
    const {
      id, title, body, date, username, comments,
    } = new ThreadDetail(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });

  describe('fromTable function', () => {
    it('should create ThreadDetail object correctly', () => {
      // Arrange
      const payload = {
        id: 'user-123',
        title: 'a title',
        body: 'a body',
        date: '2020-01-01T00:00:00Z',
        username: 'user123',
        comments: [
          {
            id: 'comment-123',
            username: 'user123',
            content: 'a content',
            date: '2020-01-01T00:00:00Z',
            replies: [
              {
                id: 'reply-127',
                username: 'user127',
                content: 'a content',
                date: '2020-04-01T00:00:00Z',
              },
            ],
          },
        ],
      };

      // Action
      const {
        id, title, body, date, username, comments,
      } = ThreadDetail.fromTable(payload);

      // Assert
      expect(id).toEqual(payload.id);
      expect(title).toEqual(payload.title);
      expect(body).toEqual(payload.body);
      expect(date).toEqual(payload.date);
      expect(username).toEqual(payload.username);
      expect(comments).toEqual(payload.comments);
    });

    it('should create ThreadDetail object with empty comments', () => {
      // Arrange
      const payload = {
        id: 'user-123',
        title: 'a title',
        body: 'a body',
        date: '2020-01-01T00:00:00Z',
        username: 'user123',
        comments: null,
      };

      // Action
      const {
        id, title, body, date, username, comments,
      } = ThreadDetail.fromTable(payload);

      // Assert
      expect(id).toEqual(payload.id);
      expect(title).toEqual(payload.title);
      expect(body).toEqual(payload.body);
      expect(date).toEqual(payload.date);
      expect(username).toEqual(payload.username);
      expect(comments).toEqual([]);
    });
  });
});
