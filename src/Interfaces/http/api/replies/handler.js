const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  #container;

  constructor(container) {
    this.#container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    const addCommentUseCase = this.#container.getInstance(AddReplyUseCase.name);
    const addedReply = await addCommentUseCase.execute({
      owner, threadId, commentId, ...request.payload,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyByIdHandler(request) {
    const { threadId, commentId, replyId: id } = request.params;
    const { id: owner } = request.auth.credentials;
    const deleteReplyUseCase = this.#container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute({
      id, owner, commentId, threadId,
    });
    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
