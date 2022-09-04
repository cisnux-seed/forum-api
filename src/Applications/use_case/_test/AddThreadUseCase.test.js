const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddThreadUseCase = require('../AddThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      title: 'a title',
      body: 'a body',
    };
    const stubPayload = {
      id: 'thread-123',
      owner: payload.owner,
      title: payload.title,
    };
    const expectedAddedThread = new AddedThread(stubPayload);

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedThread(stubPayload)));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(payload);

    // Assert
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread(payload));
    expect(addedThread).toStrictEqual(expectedAddedThread);
  });
});
