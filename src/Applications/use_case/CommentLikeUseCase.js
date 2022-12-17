const CommentLike = require('../../Domains/comment_likes/entities/CommentLike');

class CommentLikeUseCase {
  #commentLikeRepository;

  #commentRepository;

  #threadRepository;

  constructor({ commentLikeRepository, threadRepository, commentRepository }) {
    this.#commentLikeRepository = commentLikeRepository;
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { id, threadId, userId } = new CommentLike(useCasePayload);

    await Promise.all([
      this.#threadRepository.checkAvailabilityThread(threadId),
      this.#commentRepository.checkAvailabilityComment(id),
    ]);
    const isLiked = await this.#commentLikeRepository.addLikeById({ id, userId });
    if (!isLiked) {
      await this.#commentLikeRepository.deleteLikeById({ id, userId });
    }
  }
}

module.exports = CommentLikeUseCase;
