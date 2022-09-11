const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');

describe('CommentRepository postgres', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('deleteLikeById function', () => {
    it('should delete like byId correctly', async () => {
      // Arrange
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user-a' });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: 'user-124' });
      const payload = { id: 'comment-123', userId: 'user-123' };
      await CommentLikesTableTestHelper.addLikeById(payload);

      // Action and Assert
      await expect(commentLikeRepository.deleteLikeById(payload)).resolves.not.toThrowError();
      const commentLikes = await CommentLikesTableTestHelper.findCommentLikeById(payload);
      expect(commentLikes).toHaveLength(0);
    });
  });

  describe('addLikeById function', () => {
    it('should add like by when like does not exist yet', async () => {
      // Arrange
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user-a' });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: 'user-124' });
      const payload = { id: 'comment-123', userId: 'user-123' };

      // Action
      const rowAffects = await commentLikeRepository.addLikeById(payload);

      // Assert
      expect(rowAffects).toEqual(1);
      const commentLikes = await CommentLikesTableTestHelper.findCommentLikeById(payload);
      // check comment likes rows
      expect(commentLikes).toHaveLength(1);
    });

    it('should not add like by when like exist', async () => {
      // Arrange
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user-a' });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: 'user-124' });
      const payload = { id: 'comment-123', userId: 'user-123' };
      await CommentLikesTableTestHelper.addLikeById({});

      // Action
      const rowAffects = await commentLikeRepository.addLikeById(payload);

      // Assert
      expect(rowAffects).toEqual(0);
      const commentLikes = await CommentLikesTableTestHelper.findCommentLikeById(payload);
      // check comment likes rows
      expect(commentLikes).toHaveLength(1);
    });
  });
});
