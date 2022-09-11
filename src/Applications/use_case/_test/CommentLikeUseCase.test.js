const CommentLike = require('../../../Domains/comment_likes/entities/CommentLike');
const CommentLikeRepository = require('../../../Domains/comment_likes/CommentLikeRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentLikeUseCase = require('../CommentLikeUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('CommentLikeUseCase', () => {
  it('should add like to comment correctly', async () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      threadId: 'thread-123',
      userId: 'user-123',
    };
    const commentLike = new CommentLike(payload);

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking checkAvailabilityTHread */
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.addLikeById = jest.fn().mockImplementation(() => Promise.resolve(1));

    /** creating use case instance */
    const commentLikeUseCase = new CommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await commentLikeUseCase.execute(payload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(commentLike.threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(commentLike.id);
    expect(mockCommentLikeRepository.addLikeById)
      .toBeCalledWith({ id: commentLike.id, userId: commentLike.userId });
  });

  it('should delete like from comment correctly', async () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      threadId: 'thread-123',
      userId: 'user-123',
    };
    const commentLike = new CommentLike(payload);

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking repositories methods */
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.addLikeById = jest.fn()
      .mockImplementation(() => Promise.resolve(0));
    mockCommentLikeRepository.deleteLikeById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const commentLikeUseCase = new CommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await commentLikeUseCase.execute(payload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(commentLike.threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(commentLike.id);
    expect(mockCommentLikeRepository.addLikeById)
      .toBeCalledWith({ id: commentLike.id, userId: commentLike.userId });
    expect(mockCommentLikeRepository.deleteLikeById)
      .toBeCalledWith({ id: commentLike.id, userId: commentLike.userId });
  });
});
