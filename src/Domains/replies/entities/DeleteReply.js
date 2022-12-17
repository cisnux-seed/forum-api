const isUndefined = require('../../../Commons/utils/undefined_variable_validation');
require('../../../Commons/utils/empty_string_validation');

class DeleteReply {
  constructor(payload) {
    this.#verifyPayload(payload);

    const {
      id, commentId, owner, threadId,
    } = payload;

    this.id = id;
    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  #verifyPayload({
    id, commentId, threadId, owner,
  }) {
    if (isUndefined(id) || isUndefined(commentId) || isUndefined(owner) || isUndefined(threadId)) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof owner !== 'string' || typeof threadId !== 'string') {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (id.isEmpty) {
      throw new Error('DELETE_REPLY.EMPTY_ID');
    }

    if (commentId.isEmpty) {
      throw new Error('DELETE_REPLY.EMPTY_COMMENT_ID');
    }

    if (threadId.isEmpty) {
      throw new Error('DELETE_REPLY.EMPTY_THREAD_ID');
    }

    if (owner.isEmpty) {
      throw new Error('DELETE_REPLY.EMPTY_OWNER');
    }
  }
}

module.exports = DeleteReply;
