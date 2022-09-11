const CommentLike = require('../../Domains/comments/entities/CommentLike');

class CommentLikeUseCase {
  #commentRepository;

  #threadRepository;

  constructor({ commentRepository, threadRepository }) {
    this.#commentRepository = commentRepository;
    this.#threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { id, threadId, userId } = new CommentLike(useCasePayload);

    await this.#threadRepository.checkAvailabilityThread(threadId);
    await this.#commentRepository.checkAvailabilityComment(id);
    const isLiked = await this.#commentRepository.addLikeById({ id, userId });
    if (!isLiked) {
      await this.#commentRepository.deleteLikeById({ id, userId });
    }
  }
}

module.exports = CommentLikeUseCase;
