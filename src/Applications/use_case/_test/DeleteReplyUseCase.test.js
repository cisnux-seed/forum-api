const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const spyDeleteReply = new DeleteReply(useCasePayload);
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Mocking
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkAvailabilityReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // create use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(spyDeleteReply.commentId);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(spyDeleteReply.threadId);
    expect(mockReplyRepository.checkAvailabilityReply).toBeCalledWith(spyDeleteReply.id);
    expect(mockReplyRepository.verifyReplyOwner)
      .toBeCalledWith({ id: spyDeleteReply.id, owner: spyDeleteReply.owner });
    expect(mockReplyRepository.deleteReplyById)
      .toBeCalledWith(spyDeleteReply.id);
  });
});
