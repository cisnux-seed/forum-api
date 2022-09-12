const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepository postgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should throw an error when thread does not exist', async () => {
      // Arrange
      const addComment = new AddComment({
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'a content',
      });
      await UsersTableTestHelper.addUser({});
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator, new Date());

      // Action and Assert
      await expect(commentRepository.addComment(addComment)).rejects.toThrow(NotFoundError);
    });

    it('should add comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'a content',
      });
      const expectedAddedComment = new AddedComment({
        id: 'comment-123',
        owner: 'user-123',
        content: 'a content',
      });
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator, new Date());

      // Action
      const addedComment = await commentRepository.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(expectedAddedComment);
    });

    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'a content',
      });
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator, new Date());

      // Action
      await commentRepository.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should add comment and return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        threadId: 'thread-123',
        owner: 'user-123',
        content: 'a content',
      });
      const expectedAddedComment = new AddedComment({
        id: 'comment-123',
        owner: 'user-123',
        content: 'a content',
      });
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator, new Date());

      // Action
      const addedComment = await commentRepository.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(expectedAddedComment);
    });
  });

  describe('checkAvailabilityComment function', () => {
    it('should throw NotFoundError if thread not available', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool);
      const id = '123';

      // Action & Assert
      await expect(commentRepository.checkAvailabilityComment(id))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if comment available', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user-a' });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: 'user-124' });
      const id = 'comment-123';

      // Action & Assert
      await expect(commentRepository.checkAvailabilityComment(id))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw an error when unauthorized user modify comment', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user-a' });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: 'user-124' });
      const payload = { id: 'comment-123', owner: 'user-122' };

      // Action and Assert
      await expect(commentRepository.verifyCommentOwner(payload))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw an error when authorized user modify comment', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user-a' });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: 'user-124' });
      const payload = { id: 'comment-123', owner: 'user-124' };

      // Action and Assert
      await expect(commentRepository.verifyCommentOwner(payload))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should throw an error when comment does not exist', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user-a' });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: 'user-124' });

      // Action and Assert
      await expect(commentRepository.deleteCommentById('comment-130')).rejects.toThrow(NotFoundError);
    });

    it('should not throw an error when comment exists', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user-a' });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: 'user-124' });

      // Action and Assert
      await expect(commentRepository.deleteCommentById('comment-123')).resolves.not.toThrow(NotFoundError);
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments[0].is_delete).toBeTruthy();
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments by thread id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'cisnux' });
      await CommentsTableTestHelper.addComment({
        threadId: 'thread-123',
        owner: 'user-124',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-124',
        threadId: 'thread-123',
        owner: 'user-124',
      });

      // Action
      const commentRepository = new CommentRepositoryPostgres(pool);
      const commentsDetail = await commentRepository.getCommentsByThreadId('thread-123');
      const [comment1, comment2] = commentsDetail;

      // Assert
      expect(commentsDetail).toHaveLength(2);
      expect(comment1.id).toBeDefined();
      expect(comment1.content).toBeDefined();
      expect(comment1.date).toBeDefined();
      expect(comment1.username).toBeDefined();
      expect(comment1.isDelete).toBeDefined();
      expect(comment1.likeCount).toBeDefined();
      expect(comment2.id).toBeDefined();
      expect(comment2.content).toBeDefined();
      expect(comment2.date).toBeDefined();
      expect(comment2.username).toBeDefined();
      expect(comment2.isDelete).toBeDefined();
      expect(comment2.likeCount).toBeDefined();
    });
  });
});
