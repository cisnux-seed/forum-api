const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const AddComment = require('../../../Domains/comments/entities/AddComment');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
      content: 'a content',
    };
    const stubPayload = {
      id: 'chat-123',
      owner: payload.owner,
      content: payload.content,
    };
    const expectedAddedComment = new AddedComment(stubPayload);

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedComment(stubPayload)));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(payload);

    // Assert
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment(payload));
    expect(addedComment).toStrictEqual(expectedAddedComment);
  });
});
