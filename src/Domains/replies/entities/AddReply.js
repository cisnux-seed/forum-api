const isUndefined = require('../../../Commons/utils/undefined_variable_validation');
require('../../../Commons/utils/empty_string_validation');

class AddReply {
  constructor(payload) {
    this.#verifyPayload(payload);

    const {
      threadId,
      commentId,
      owner,
      content,
    } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
    this.content = content;
  }

  #verifyPayload({
    owner, threadId, commentId, content,
  }) {
    if (isUndefined(owner) || isUndefined(threadId)
    || isUndefined(commentId) || isUndefined(content)) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof threadId !== 'string'
    || typeof commentId !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (owner.isEmpty) {
      throw new Error('ADD_REPLY.EMPTY_OWNER');
    }

    if (threadId.isEmpty) {
      throw new Error('ADD_REPLY.EMPTY_THREAD_ID');
    }

    if (commentId.isEmpty) {
      throw new Error('ADD_REPLY.EMPTY_COMMENT_ID');
    }

    if (content.isEmpty) {
      throw new Error('ADD_REPLY.EMPTY_CONTENT');
    }

    if (owner.length > 50) {
      throw new Error('ADD_REPLY.OWNER_LIMIT_CHAR');
    }

    if (threadId.length > 50) {
      throw new Error('ADD_REPLY.THREAD_ID_LIMIT_CHAR');
    }

    if (commentId.length > 50) {
      throw new Error('ADD_REPLY.COMMENT_ID_LIMIT_CHAR');
    }
  }
}

module.exports = AddReply;
