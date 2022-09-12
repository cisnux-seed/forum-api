const DeleteReply = require('../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
  #replyRepository;

  #commentRepository;

  #threadRepository;

  constructor({ replyRepository, commentRepository, threadRepository }) {
    this.#replyRepository = replyRepository;
    this.#commentRepository = commentRepository;
    this.#threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const {
      id, commentId, owner, threadId,
    } = new DeleteReply(useCasePayload);
    await Promise.all([
      this.#threadRepository.checkAvailabilityThread(threadId),
      this.#commentRepository.checkAvailabilityComment(commentId),
      this.#replyRepository.checkAvailabilityReply(id),
    ]);
    await this.#replyRepository.verifyReplyOwner({ id, owner });
    await this.#replyRepository.deleteReplyById(id);
  }
}

module.exports = DeleteReplyUseCase;
