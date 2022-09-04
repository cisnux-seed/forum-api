const isUndefined = require('../../../Commons/utils/undefined_variable_validation');

class AddedThread {
  constructor(payload) {
    this.#verifyPayload(payload);

    const { id, owner, title } = payload;

    this.id = id;
    this.owner = owner;
    this.title = title;
  }

  #verifyPayload({ id, owner, title }) {
    if (isUndefined(id) || isUndefined(owner) || isUndefined(title)) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof owner !== 'string' || typeof title !== 'string') {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThread;
