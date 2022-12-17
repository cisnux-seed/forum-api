const isUndefined = require('../../Commons/utils/undefined_variable_validation');
require('../../Commons/utils/empty_string_validation');

class RefreshAuthenticationUseCase {
  #authenticationRepository;

  #authenticationTokenManager;

  constructor({
    authenticationRepository,
    authenticationTokenManager,
  }) {
    this.#authenticationRepository = authenticationRepository;
    this.#authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload) {
    this.#verifyPayload(useCasePayload);
    const { refreshToken } = useCasePayload;

    await this.#authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this.#authenticationRepository.checkAvailabilityToken(refreshToken);

    const { username, id } = await this.#authenticationTokenManager.decodePayload(refreshToken);

    return this.#authenticationTokenManager.createAccessToken({ username, id });
  }

  #verifyPayload(payload) {
    const { refreshToken } = payload;

    if (isUndefined(refreshToken)) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (refreshToken.isEmpty) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_IS_EMPTY');
    }
  }
}

module.exports = RefreshAuthenticationUseCase;
