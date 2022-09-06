const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const AuthenticationsHandlerTestHelper = require('../../../../tests/AuthenticationsHandlerTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('/threads endpoint', () => {
  let accessToken = null;

  beforeAll(async () => {
    accessToken = await AuthenticationsHandlerTestHelper
      .login(await AuthenticationsHandlerTestHelper.register({}));
  });

  afterAll(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    accessToken = null;
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'a title',
        body: 'a body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(typeof responseJson.data.addedThread.id).toBe('string');
      expect(typeof responseJson.data.addedThread.owner).toBe('string');
      expect(typeof responseJson.data.addedThread.title).toBe('string');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'a title',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: ['a title'],
        body: true,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 401 when unauthenticated user add thread', async () => {
      // Arrange
      const requestPayload = {
        title: ['a title'],
        body: true,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
    });
  });

  describe('when GET /threads/{id}', () => {
    it('should response 200 and return thread detail', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123', date: '2020-01-01T00:00:00' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user-a' });
      await CommentsTableTestHelper.addComment({
        threadId: 'thread-123',
        owner: 'user-124',
        date: '2020-01-01T00:00:00',
      });
      await UsersTableTestHelper.addUser({ id: 'user-125', username: 'user-b' });
      await RepliesTableTestHelper.addReply({
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-125',
        date: '2020-01-01T00:00:00',
      });
      const server = await createServer(container);

      // Action'
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(typeof responseJson.data.thread.id).toBe('string');
      expect(typeof responseJson.data.thread.title).toBe('string');
      expect(typeof responseJson.data.thread.body).toBe('string');
      expect(typeof responseJson.data.thread.date).toBe('string');
      expect(Array.isArray(responseJson.data.thread.comments)).toBeTruthy();
      expect(Array.isArray(responseJson.data.thread.comments[0].replies)).toBeTruthy();
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action'
      const response = await server.inject({
        method: 'GET',
        url: '/threads/xxx',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
