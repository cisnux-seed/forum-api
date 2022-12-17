const isUndefined = require('../../../Commons/utils/undefined_variable_validation');
require('../../../Commons/utils/empty_string_validation');

class DeleteComment {
  constructor(payload) {
    this.#verifyPayload(payload);

    const { id, owner, threadId } = payload;

    this.id = id;
    this.owner = owner;
    this.threadId = threadId;
  }

  #verifyPayload({ id, threadId, owner }) {
    if (isUndefined(id) || isUndefined(owner) || isUndefined(threadId)) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof owner !== 'string' || typeof threadId !== 'string') {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (id.isEmpty) {
      throw new Error('DELETE_COMMENT.EMPTY_ID');
    }

    if (owner.isEmpty) {
      throw new Error('DELETE_COMMENT.EMPTY_OWNER');
    }

    if (threadId.isEmpty) {
      throw new Error('DELETE_COMMENT.EMPTY_THREAD_ID');
    }
  }
}

module.exports = DeleteComment;
