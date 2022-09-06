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
    await this.#threadRepository.checkAvailabilityThread(threadId);
    await this.#commentRepository.checkAvailabilityComment(commentId);
    await this.#replyRepository.checkAvailabilityReply(id);
    await this.#replyRepository.verifyReplyOwner({ id, owner });
    await this.#replyRepository.deleteReplyById(id);
  }
}

module.exports = DeleteReplyUseCase;
