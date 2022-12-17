const isUndefined = require('../../../Commons/utils/undefined_variable_validation');
require('../../../Commons/utils/empty_string_validation');

class CommentLike {
  constructor(payload) {
    this.#verifyPayload(payload);

    const { id, threadId, userId } = payload;

    this.id = id;
    this.threadId = threadId;
    this.userId = userId;
  }

  #verifyPayload({ id, threadId, userId }) {
    if (isUndefined(id) || isUndefined(threadId) || isUndefined(userId)) {
      throw new Error('COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof threadId !== 'string' || typeof userId !== 'string') {
      throw new Error('COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (id.isEmpty) {
      throw new Error('COMMENT_LIKE.EMPTY_ID');
    }

    if (threadId.isEmpty) {
      throw new Error('COMMENT_LIKE.EMPTY_THREAD_ID');
    }

    if (userId.isEmpty) {
      throw new Error('COMMENT_LIKE.EMPTY_USER_ID');
    }
  }
}

module.exports = CommentLike;
