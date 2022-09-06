const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  #commentRepository;

  constructor({ commentRepository }) {
    this.#commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    const addedComment = await this.#commentRepository.addComment(addComment);
    return addedComment;
  }
}

module.exports = AddCommentUseCase;
