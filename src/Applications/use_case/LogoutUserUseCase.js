class LogoutUserUseCase {
  #authenticationRepository;

  constructor({
    authenticationRepository,
  }) {
    this.#authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload) {
    this.#validatePayload(useCasePayload);
    const { refreshToken } = useCasePayload;
    await this.#authenticationRepository.checkAvailabilityToken(refreshToken);
    await this.#authenticationRepository.deleteToken(refreshToken);
  }

  #validatePayload(payload) {
    const { refreshToken } = payload;
    if (!refreshToken) {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LogoutUserUseCase;
