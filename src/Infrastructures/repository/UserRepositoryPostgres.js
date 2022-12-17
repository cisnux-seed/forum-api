const InvariantError = require('../../Commons/exceptions/InvariantError');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../Domains/users/UserRepository');
const logger = require('../../Commons/utils/logger');

class UserRepositoryPostgres extends UserRepository {
  #pool;

  #idGenerator;

  constructor(pool, idGenerator) {
    super();
    this.#pool = pool;
    this.#idGenerator = idGenerator;
  }

  async addUser(registerUser) {
    const { username, password, fullname } = registerUser;
    const id = `user-${this.#idGenerator()}`;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    };
    await this.#pool.query('BEGIN');
    const result = await this.#pool.query(query).catch(async (error) => {
      await this.#pool.query('ROLLBACK');
      /* istanbul ignore else */if (error.code === '23505') {
        /* istanbul ignore next */logger.debug({
          postgres_error_code: error.code,
          error: InvariantError.name,
        }, 'username is already used');
        throw new InvariantError('username tidak tersedia');
      }
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
        method: 'addUser',
        trace: error,
      }, error.message);
    });
    await this.#pool.query('COMMIT');
    return new RegisteredUser(result.rows[0]);
  }

  async getPasswordByUsername(username) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.#pool.query(query).catch(/* istanbul ignore next */(error) => {
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
        method: 'getPasswordByUsername',
        trace: error,
      }, error.message);
    });

    if (!result.rowCount) {
      /* istanbul ignore next */logger.debug({
        error: InvariantError.name,
      }, 'username is invalid');
      throw new InvariantError('username tidak ditemukan');
    }

    return result.rows[0].password;
  }

  async getIdByUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.#pool.query(query).catch(/* istanbul ignore next */(error) => {
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
        method: 'getIdByUsername',
        trace: error,
      }, error.message);
    });

    if (!result.rowCount) {
      /* istanbul ignore next */logger.debug({
        error: InvariantError.name,
      }, 'user is invalid');
      throw new InvariantError('user tidak valid');
    }

    const { id } = result.rows[0];

    return id;
  }
}

module.exports = UserRepositoryPostgres;
