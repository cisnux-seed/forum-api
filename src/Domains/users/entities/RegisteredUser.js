const isUndefined = require('../../../Commons/utils/undefined_variable_validation');

class RegisteredUser {
  constructor(payload) {
    this.#verifyPayload(payload);

    const { id, username, fullname } = payload;

    this.id = id;
    this.username = username;
    this.fullname = fullname;
  }

  #verifyPayload({ id, username, fullname }) {
    if (isUndefined(id) || isUndefined(username) || isUndefined(fullname)) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof fullname !== 'string') {
      throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisteredUser;
