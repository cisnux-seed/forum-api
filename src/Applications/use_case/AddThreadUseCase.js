const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  #threadRepository;

  constructor({ threadRepository }) {
    this.#threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addThread = new AddThread(useCasePayload);
    const addedThread = await this.#threadRepository.addThread(addThread);
    return addedThread;
  }
}

module.exports = AddThreadUseCase;
