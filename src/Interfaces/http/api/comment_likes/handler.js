const CommentLikeUseCase = require('../../../../Applications/use_case/CommentLikeUseCase');

class CommentLikesHandler {
  #container;

  constructor(container) {
    this.#container = container;

    this.putCommentLikesHandler = this.putCommentLikesHandler.bind(this);
  }

  async putCommentLikesHandler(request) {
    const { threadId, commentId: id } = request.params;
    const { id: userId } = request.auth.credentials;
    const commentLikeUseCase = this.#container.getInstance(CommentLikeUseCase.name);
    await commentLikeUseCase.execute({ id, threadId, userId });
    return {
      status: 'success',
    };
  }
}

module.exports = CommentLikesHandler;
