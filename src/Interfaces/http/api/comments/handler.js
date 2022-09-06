const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  #container;

  constructor(container) {
    this.#container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { threadId } = request.params;
    const { id: owner } = request.auth.credentials;
    const addCommentUserCase = this.#container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUserCase.execute({ owner, threadId, ...request.payload });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentByIdHandler(request) {
    const { threadId, commentId: id } = request.params;
    const { id: owner } = request.auth.credentials;
    const deleteCommentUserCase = this.#container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUserCase.execute({ id, owner, threadId });
    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
