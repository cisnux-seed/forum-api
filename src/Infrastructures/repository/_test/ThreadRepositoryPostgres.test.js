const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        owner: 'user-123',
        title: 'a thread',
        body: 'a body',
      });
      await UsersTableTestHelper.addUser({});
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator, new Date());

      // Action
      await threadRepository.addThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should add thread and return added thread correctly', async () => {
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
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });

      // Action
      const threadRepository = new ThreadRepositoryPostgres(pool);
      const threadDetail = await threadRepository.getThreadById('thread-123');

      // Assert
      expect(threadDetail.id).toStrictEqual('thread-123');
      expect(threadDetail.title).toBeDefined();
      expect(threadDetail.body).toBeDefined();
      expect(threadDetail.date).toBeDefined();
      expect(threadDetail.username).toBeDefined();
    });
  });
});
