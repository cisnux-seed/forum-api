const isUndefined = require('../../../Commons/utils/undefined_variable_validation');

class UserLogin {
  constructor(payload) {
    this.#verifyPayload(payload);

    this.username = payload.username;
    this.password = payload.password;
  }

  #verifyPayload(payload) {
    const { username, password } = payload;

    if (isUndefined(username) || isUndefined(password)) {
      throw new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = UserLogin;
