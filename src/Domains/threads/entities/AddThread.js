const isUndefined = require('../../../Commons/utils/undefined_variable_validation');
require('../../../Commons/utils/empty_string_validation');

class AddThread {
  constructor(payload) {
    this.#verifyPayload(payload);

    const { owner, title, body } = payload;

    this.owner = owner;
    this.title = title;
    this.body = body;
  }

  #verifyPayload({ owner, title, body }) {
    if (isUndefined(owner) || isUndefined(title) || isUndefined(body)) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (owner.isEmpty) {
      throw new Error('ADD_THREAD.EMPTY_OWNER');
    }

    if (title.isEmpty) {
      throw new Error('ADD_THREAD.EMPTY_TITLE');
    }

    if (body.isEmpty) {
      throw new Error('ADD_THREAD.EMPTY_BODY');
    }

    if (owner.length > 50) {
      throw new Error('ADD_THREAD.OWNER_LIMIT_CHAR');
    }
  }
}

module.exports = AddThread;
