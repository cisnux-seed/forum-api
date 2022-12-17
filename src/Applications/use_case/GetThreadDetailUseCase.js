require('../../Commons/utils/empty_string_validation');
const isUndefined = require('../../Commons/utils/undefined_variable_validation');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class GetThreadDetailUseCase {
  #threadRepository;

  #commentRepository;

  #replyRepository;

  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
    this.#replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this.#validatePayload(useCasePayload);
    const comments = await this.#commentRepository.getCommentsByThreadId(useCasePayload);
    const replies = await this.#replyRepository
      .getRepliesByCommentIds(comments.map((comment) => comment.id));
    const threadDetail = await this.#threadRepository.getThreadById(useCasePayload);
    threadDetail.comments = comments
      .map((comment) => ({
        ...comment,
        replies: replies.filter((reply) => reply.commentId === comment.id),
      }));
    return ThreadDetail.fromTable(threadDetail);
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
