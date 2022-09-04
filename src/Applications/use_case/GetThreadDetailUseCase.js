require('../../Commons/utils/empty_string_validation');
const isUndefined = require('../../Commons/utils/undefined_variable_validation');

class GetThreadDetailUseCase {
  #threadRepository;

  constructor({ threadRepository }) {
    this.#threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this.#validatePayload(useCasePayload);
    const threadDetail = await this.#threadRepository.getThreadById(useCasePayload);
    return threadDetail;
  }

  #validatePayload(threadId) {
    if (isUndefined(threadId)) {
      throw new Error('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_THREAD_ID');
    }

    if (typeof threadId !== 'string') {
      throw new Error('GET_THREAD_DETAIL_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (threadId.isEmpty) {
      throw Error('GET_THREAD_DETAIL_USE_CASE.THREAD_ID_IS_EMPTY');
    }
  }
}

module.exports = GetThreadDetailUseCase;
