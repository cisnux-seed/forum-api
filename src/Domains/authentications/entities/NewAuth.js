const isUndefined = require('../../../Commons/utils/undefined_variable_validation');
require('../../../Commons/utils/empty_string_validation');

class NewAuth {
  constructor(payload) {
    this.#verifyPayload(payload);

    this.accessToken = payload.accessToken;
    this.refreshToken = payload.refreshToken;
  }

  #verifyPayload(payload) {
    const { accessToken, refreshToken } = payload;

    if (isUndefined(accessToken) || isUndefined(refreshToken)) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (refreshToken.isEmpty) {
      throw new Error('NEW_AUTH.EMPTY_REFRESH_TOKEN');
    }

    if (accessToken.isEmpty) {
      throw new Error('NEW_AUTH.EMPTY_ACCESS_TOKEN');
    }
  }
}

module.exports = NewAuth;
