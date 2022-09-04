const UserLogin = require('../../Domains/users/entities/UserLogin');
const NewAuthentication = require('../../Domains/authentications/entities/NewAuth');

class LoginUserUseCase {
  #userRepository;

  #authenticationRepository;

  #authenticationTokenManager;

  #passwordHash;

  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
  }) {
    this.#userRepository = userRepository;
    this.#authenticationRepository = authenticationRepository;
    this.#authenticationTokenManager = authenticationTokenManager;
    this.#passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const { username, password } = new UserLogin(useCasePayload);

    const encryptedPassword = await this.#userRepository.getPasswordByUsername(username);

    await this.#passwordHash.comparePassword(password, encryptedPassword);

    const id = await this.#userRepository.getIdByUsername(username);

    const accessToken = await this.#authenticationTokenManager
      .createAccessToken({ username, id });
    const refreshToken = await this.#authenticationTokenManager
      .createRefreshToken({ username, id });

    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken,
    });

    await this.#authenticationRepository.addToken(newAuthentication.refreshToken);

    return newAuthentication;
  }
}

module.exports = LoginUserUseCase;
