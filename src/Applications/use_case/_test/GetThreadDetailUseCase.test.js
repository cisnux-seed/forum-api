const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const CommentReplyDetail = require('../../../Domains/comments/entities/CommentReplyDetail');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

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
    const commentsStubPayload = [
      {
        id: 'comment-123',
        username: 'user123',
        content: 'a content',
        date: '2020-01-01T00:00:00Z',
        isDelete: false,
        likeCount: '21',
      },
    ];
    const repliesStubPayload = [
      {
        id: 'reply-127',
        username: 'user127',
        content: 'a content',
        date: '2020-04-01T00:00:00Z',
        isDelete: false,
        commentId: 'comment-123',
      },
    ];
    const threadStubPayload = {
      id: 'user-123',
      title: 'a title',
      body: 'a body',
      date: '2020-01-01T00:00:00Z',
      username: 'user123',
    };

    const expectedThreadDetail = new ThreadDetail({
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
          likeCount: '21',
        }),
      ],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(commentsStubPayload));
    mockReplyRepository.getRepliesByCommentIds = jest.fn()
      .mockImplementation(() => Promise.resolve(repliesStubPayload));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(threadStubPayload));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(threadStubPayload.id);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadStubPayload.id);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadStubPayload.id);
    expect(mockReplyRepository.getRepliesByCommentIds).toBeCalledWith([commentsStubPayload[0].id]);
    expect(threadDetail).toStrictEqual(expectedThreadDetail);
  });
});
