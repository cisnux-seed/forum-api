const RegisterUser = require('../../Domains/users/entities/RegisterUser');

class AddUserUseCase {
  #userRepository;

  #passwordHash;

  constructor({ userRepository, passwordHash }) {
    this.#userRepository = userRepository;
    this.#passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    registerUser.password = await this.#passwordHash.hash(registerUser.password);
    return this.#userRepository.addUser(registerUser);
  }
}

module.exports = AddUserUseCase;
