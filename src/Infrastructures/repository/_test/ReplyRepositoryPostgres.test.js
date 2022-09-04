const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const CommentReplyDetail = require('../../../Domains/comments/entities/CommentReplyDetail');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ReplyRepository postgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should throw an error when thread is not exist', async () => {
      // Arrange
      const addReply = new AddReply({
        threadId: 'thread-127',
        owner: 'user-125',
        commentId: 'comment-123',
        content: 'a content',
      });
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user-a' });
      await UsersTableTestHelper.addUser({ id: 'user-125', username: 'user-b' });

      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: 'user-124' });
      const fakeIdGenerator = () => '123';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator, new Date());

      // Action and Assert
      await expect(replyRepository.addReply(addReply)).rejects.toThrow(NotFoundError);
    });

    it('should throw an error when comment is not exist', async () => {
      // Arrange
      const addReply = new AddReply({
        threadId: 'thread-123',
        owner: 'user-125',
        commentId: 'comment-127',
        content: 'a content',
      });
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user-a' });
      await UsersTableTestHelper.addUser({ id: 'user-125', username: 'user-b' });

      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: 'user-124' });
      const fakeIdGenerator = () => '123';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator, new Date());

      // Action and Assert
      await expect(replyRepository.addReply(addReply)).rejects.toThrow(NotFoundError);
    });

    it('should persist add reply and return added reply correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        threadId: 'thread-123',
        owner: 'user-125',
        commentId: 'comment-123',
        content: 'a content',
      });
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user-a' });
      await UsersTableTestHelper.addUser({ id: 'user-125', username: 'user-b' });

      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: 'user-124' });
      const fakeIdGenerator = () => '123';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator, new Date());

      // Action
      await replyRepository.addReply(addReply);
      const replies = await CommentsTableTestHelper.findCommentById('comment-123');

      // Assert
      expect(replies).toHaveLength(1);
    });

    it('should add reply correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        threadId: 'thread-123',
        owner: 'user-125',
        commentId: 'comment-123',
        content: 'a content',
      });
      const expectedAddedReply = new AddedReply({
        id: 'reply-123',
        owner: 'user-125',
        content: 'a content',
      });
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user-a' });
      await UsersTableTestHelper.addUser({ id: 'user-125', username: 'user-b' });

      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: 'user-124' });
      const fakeIdGenerator = () => '123';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator, new Date());

      // Action
      const addedReply = await replyRepository.addReply(addReply);

      // Assert
      expect(addedReply).toStrictEqual(expectedAddedReply);
    });
  });

  describe('checkAvailabilityReply function', () => {
    it('should throw NotFoundError if thread not available', async () => {
      // Arrange
      const commentRepository = new ReplyRepositoryPostgres(pool);
      const id = '123';

      // Action & Assert
      await expect(commentRepository.checkAvailabilityReply(id))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if comment available', async () => {
      // Arrange
      const commentRepository = new ReplyRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user-a' });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: 'user-124' });
      await UsersTableTestHelper.addUser({ id: 'user-125', username: 'user-b' });
      await RepliesTableTestHelper.addReply({ commentId: 'comment-123', threadId: 'thread-123', owner: 'user-124' });
      const id = 'reply-123';

      // Action & Assert
      await expect(commentRepository.checkAvailabilityReply(id))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw an error when unauthorized user modify reply', async () => {
      // Arrange
      const replyRepository = new ReplyRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user-a' });
      await UsersTableTestHelper.addUser({ id: 'user-125', username: 'user-b' });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: 'user-124' });
      await RepliesTableTestHelper.addReply({ commentId: 'comment-123', threadId: 'thread-123', owner: 'user-125' });
      const payload = { id: 'reply-123', owner: 'user-120' };

      // Action and Assert
      await expect(replyRepository.verifyReplyOwner(payload))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw an error when authorized user modify reply', async () => {
      // Arrange
      const replyRepository = new ReplyRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user-a' });
      await UsersTableTestHelper.addUser({ id: 'user-125', username: 'user-b' });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner: 'user-124' });
      await RepliesTableTestHelper.addReply({ commentId: 'comment-123', threadId: 'thread-123', owner: 'user-125' });
      const payload = { id: 'reply-123', owner: 'user-125' };

      // Action and Assert
      await expect(replyRepository.verifyReplyOwner(payload))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReply function', () => {
    it('should not throw an error when reply is exist', async () => {
      // Arrange
      const expectedThreadDetailAfterDeleteReply = new ThreadDetail({
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
                content: '**balasan telah dihapus**',
                date: '2020-01-01T00:00:00',
              }),
            ],
          }),
        ],
      });
      const replyRepository = new ReplyRepositoryPostgres(pool);
      const threadRepository = new ThreadRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123', date: '2020-01-01T00:00:00' });
      // create another user
      await UsersTableTestHelper.addUser({ id: 'user-124', username: 'user-a' });
      await UsersTableTestHelper.addUser({ id: 'user-125', username: 'user-b' });
      await CommentsTableTestHelper.addComment({
        threadId: 'thread-123',
        owner: 'user-124',
        date: '2020-01-01T00:00:00',
      });
      await RepliesTableTestHelper.addReply({
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-125',
        date: '2020-01-01T00:00:00',
      });

      // Action and Assert
      await expect(replyRepository.deleteReplyById('reply-123')).resolves.not.toThrow(NotFoundError);
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies[0].is_delete).toBeTruthy();

      const threadDetail = await threadRepository.getThreadById('thread-123');
      expect(threadDetail).toStrictEqual(expectedThreadDetailAfterDeleteReply);
    });
  });
});
