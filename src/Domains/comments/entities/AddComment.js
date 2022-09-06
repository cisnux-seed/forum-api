const isUndefined = require('../../../Commons/utils/undefined_variable_validation');
require('../../../Commons/utils/empty_string_validation');

class AddComment {
  constructor(payload) {
    this.#verifyPayload(payload);

    const { owner, threadId, content } = payload;

    this.owner = owner;
    this.threadId = threadId;
    this.content = content;
  }

  #verifyPayload({ owner, threadId, content }) {
    if (isUndefined(owner) || isUndefined(threadId) || isUndefined(content)) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof threadId !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (owner.isEmpty) {
      throw new Error('ADD_COMMENT.EMPTY_OWNER');
    }

    if (threadId.isEmpty) {
      throw new Error('ADD_COMMENT.EMPTY_THREAD_ID');
    }

    if (content.isEmpty) {
      throw new Error('ADD_COMMENT.EMPTY_CONTENT');
    }

    if (owner.length > 50) {
      throw new Error('ADD_COMMENT.OWNER_LIMIT_CHAR');
    }

    if (threadId.length > 50) {
      throw new Error('ADD_COMMENT.THREAD_ID_LIMIT_CHAR');
    }
  }
}

module.exports = AddComment;
