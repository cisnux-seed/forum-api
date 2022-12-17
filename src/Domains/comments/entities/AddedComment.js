const isUndefined = require('../../../Commons/utils/undefined_variable_validation');

class AddedComment {
  constructor(payload) {
    this.#verifyPayload(payload);

    const {
      id, owner, content,
    } = payload;

    this.id = id;
    this.owner = owner;
    this.content = content;
  }

  #verifyPayload({
    id, owner, content,
  }) {
    if (isUndefined(id) || isUndefined(owner) || isUndefined(content)) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;
