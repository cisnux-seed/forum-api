const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const AuthenticationsHandlerTestHelper = require('../../../../tests/AuthenticationsHandlerTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/comment_likes endpoint', () => {
  let accessTokenA = null;

  beforeAll(async () => {
    accessTokenA = await AuthenticationsHandlerTestHelper
      .login(await AuthenticationsHandlerTestHelper.register({}));
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });
  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 when comment is exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user b' });
      await CommentsTableTestHelper.addComment({ owner: 'user-124', threadId: 'thread-123' });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessTokenA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(await CommentLikesTableTestHelper.findCommentLikeById({ userId: 'user-124' })).toHaveLength(0);
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user b' });
      await CommentsTableTestHelper.addComment({ owner: 'user-124', threadId: 'thread-123' });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/xxx/likes',
        headers: {
          Authorization: `Bearer ${accessTokenA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user b' });
      await CommentsTableTestHelper.addComment({ owner: 'user-124', threadId: 'thread-123' });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/xxx/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessTokenA}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 401 when unauthenticated user add like to comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user b' });
      await CommentsTableTestHelper.addComment({ owner: 'user-124', threadId: 'thread-123' });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
      });

      // Assert
      JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
    });
  });
});
