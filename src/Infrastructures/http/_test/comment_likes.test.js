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
  let userId = null;

  beforeAll(async () => {
    const { id, username, password } = await AuthenticationsHandlerTestHelper.register({});
    userId = id;
    accessTokenA = await AuthenticationsHandlerTestHelper
      .login({ username, password });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await pool.end();
    accessTokenA = null;
    userId = null;
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 when comment is exist and action is delete like from comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user b' });
      await CommentsTableTestHelper.addComment({ owner: 'user-124', threadId: 'thread-123' });
      const server = await createServer(container);
      await CommentLikesTableTestHelper.addLikeById({ userId });

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

    it('should response 200 when comment is not exist and action is add like to comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-125', username: 'user z' });
      await ThreadsTableTestHelper.addThread({ owner: 'user-125' });
      await UsersTableTestHelper.addUser({ id: 'user-126', username: 'user c' });
      await CommentsTableTestHelper.addComment({ owner: 'user-126', threadId: 'thread-123' });
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
      expect(await CommentLikesTableTestHelper.findCommentLikeById({ userId })).toHaveLength(1);
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-127', username: 'user d' });
      await ThreadsTableTestHelper.addThread({ owner: 'user-127' });
      await UsersTableTestHelper.addUser({ id: 'user-128', username: 'user e' });
      await CommentsTableTestHelper.addComment({ owner: 'user-128', threadId: 'thread-123' });
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
      await UsersTableTestHelper.addUser({ id: 'user-129', username: 'user f' });
      await ThreadsTableTestHelper.addThread({ owner: 'user-129' });
      await UsersTableTestHelper.addUser({ id: 'user-130', username: 'user g' });
      await CommentsTableTestHelper.addComment({ owner: 'user-130', threadId: 'thread-123' });
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
      await UsersTableTestHelper.addUser({ id: 'user-131', username: 'user h' });
      await ThreadsTableTestHelper.addThread({ owner: 'user-131' });
      await UsersTableTestHelper.addUser({ id: 'user-132', username: 'user i' });
      await CommentsTableTestHelper.addComment({ owner: 'user-132', threadId: 'thread-123' });
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
