const AddedReply = require('../../../Domains/comments/entities/AddedComment');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const AddReply = require('../../../Domains/replies/entities/AddReply');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
      content: 'a content',
    };
    const stubPayload = {
      id: 'reply-123',
      owner: payload.owner,
      content: payload.content,
    };
    const expectedAddedComment = new AddedReply(stubPayload);

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedReply(stubPayload)));

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(payload);

    // Assert
    expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply(payload));
    expect(addedReply).toStrictEqual(expectedAddedComment);
  });
});
