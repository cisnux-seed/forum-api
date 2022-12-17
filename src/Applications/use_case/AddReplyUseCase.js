const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  #replyRepository;

  constructor({ replyRepository }) {
    this.#replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    const addedReply = await this.#replyRepository.addReply(addReply);
    return addedReply;
  }
}

module.exports = AddReplyUseCase;
