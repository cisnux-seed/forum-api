const isUndefined = require('../../../Commons/utils/undefined_variable_validation');
require('../../../Commons/utils/empty_string_validation');

class RegisterUser {
  constructor(payload) {
    this.#verifyPayload(payload);

    const { username, password, fullname } = payload;

    this.username = username;
    this.password = password;
    this.fullname = fullname;
  }

  #verifyPayload({ username, password, fullname }) {
    if (isUndefined(username) || isUndefined(password) || isUndefined(fullname)) {
      throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string' || typeof fullname !== 'string') {
      throw new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    if (fullname.isEmpty) {
      throw new Error('REGISTER_USER.EMPTY_FULLNAME');
    }

    if (username.length > 50) {
      throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR');
    }

    if (!username.match(/^[\w]+$/)) {
      throw new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
    }
  }
}

module.exports = RegisterUser;
