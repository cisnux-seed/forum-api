const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const CommentReplyDetail = require('../../../Domains/comments/entities/CommentReplyDetail');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add thread to database', async () => {
      // Arrange
      const addThread = new AddThread({
        owner: 'user-123',
        title: 'a thread',
        body: 'a body',
      });
      const expectedAddedThread = new AddedThread({
        id: 'thread-123',
        owner: 'user-123',
        title: 'a thread',
      });
      await UsersTableTestHelper.addUser({});
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator, new Date());

      // Action
      const addedThread = await threadRepository.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(expectedAddedThread);
    });
  });

  describe('checkAvailabilityThread function', () => {
    it('should throw NotFoundError if thread not available', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool);
      const id = '123';

      // Action & Assert
      await expect(threadRepository.checkAvailabilityThread(id))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if thread available', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      const id = 'thread-123';

      // Action & Assert
      await expect(threadRepository.checkAvailabilityThread(id))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getThreadDetailById function', () => {
    it('should throw NotFoundError if thread not available', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool);
      const id = '123';

      // Action & Assert
      await expect(threadRepository.getThreadById(id))
        .rejects.toThrow(NotFoundError);
    });

    it('should return thread by id correctly', async () => {
      // Arrange
      const expectedThreadDetail = new ThreadDetail({
        id: 'thread-123',
        title: 'a title',
        body: 'a body',
        date: '2020-01-01T00:00:00',
        username: 'dicoding',
        comments: [
          new CommentReplyDetail({
            id: 'comment-123',
            username: 'user-a',
            content: 'a content',
            date: '2020-01-01T00:00:00',
            replies: [
              new CommentDetail({
                id: 'reply-123',
                username: 'user-b',
                content: 'a content',
                date: '2020-01-01T00:00:00',
              }),
            ],
          }),
        ],
      });
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

      // Action
      const threadRepository = new ThreadRepositoryPostgres(pool);
      const threadDetail = await threadRepository.getThreadById('thread-123');

      // Assert
      expect(threadDetail).toStrictEqual(expectedThreadDetail);
    });
  });
});
