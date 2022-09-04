const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  #threadRepository;

  #commentRepository;

  constructor({ threadRepository, commentRepository }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { id, owner, threadId } = new DeleteComment(useCasePayload);
    await this.#threadRepository.checkAvailabilityThread(threadId);
    await this.#commentRepository.checkAvailabilityComment(id);
    await this.#commentRepository.verifyCommentOwner({ id, owner });
    await this.#commentRepository.deleteCommentById(id);
  }
}

module.exports = DeleteCommentUseCase;
