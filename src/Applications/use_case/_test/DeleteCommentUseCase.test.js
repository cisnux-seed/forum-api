const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };
    const spyDeleteComment = new DeleteComment(useCasePayload);
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Mocking
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // create use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(spyDeleteComment.id);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(spyDeleteComment.threadId);
    expect(mockCommentRepository.verifyCommentOwner)
      .toBeCalledWith({ id: spyDeleteComment.id, owner: spyDeleteComment.owner });
    expect(mockCommentRepository.deleteCommentById)
      .toBeCalledWith(spyDeleteComment.id);
  });
});
