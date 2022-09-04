const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const CommentReplyDetail = require('../../../Domains/comments/entities/CommentReplyDetail');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');

describe('GetThreadDetailUseCase', () => {
  it('should throw error if use case payload not contain thread id', async () => {
    // Arrange
    const getThreadDetailUseCase = new GetThreadDetailUseCase({});

    // Action and Assert
    await expect(getThreadDetailUseCase
      .execute())
      .rejects
      .toThrowError('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_THREAD_ID');
  });
  it('should throw error if use case payload not contain thread id', async () => {
    // Arrange
    const threadId = 23;
    const getThreadDetailUseCase = new GetThreadDetailUseCase({});

    // Action and Assert
    await expect(getThreadDetailUseCase
      .execute(threadId))
      .rejects
      .toThrowError('GET_THREAD_DETAIL_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should throw error when thread id is empty', async () => {
    // Arrange
    const threadId = '       ';
    const getThreadDetailUseCase = new GetThreadDetailUseCase({});

    // Action and Assert
    await expect(getThreadDetailUseCase
      .execute(threadId))
      .rejects
      .toThrowError('GET_THREAD_DETAIL_USE_CASE.THREAD_ID_IS_EMPTY');
  });
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const stubPayload = {
      id: 'user-123',
      title: 'a title',
      body: 'a body',
      date: '2020-01-01T00:00:00Z',
      username: 'user123',
      comments: [
        new CommentReplyDetail({
          id: 'comment-123',
          username: 'user123',
          content: 'a content',
          date: '2020-01-01T00:00:00Z',
          replies: [
            new CommentDetail({
              id: 'reply-127',
              username: 'user127',
              content: 'a content',
              date: '2020-04-01T00:00:00Z',
            }),
          ],
        }),
      ],
    };

    const expectedDetailThread = new ThreadDetail(stubPayload);

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new ThreadDetail(stubPayload)));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const detailThread = await getThreadDetailUseCase.execute(stubPayload.id);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(stubPayload.id);
    expect(detailThread).toStrictEqual(expectedDetailThread);
  });
});
