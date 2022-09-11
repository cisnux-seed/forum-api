const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthenticationRepository = require('../../Domains/authentications/AuthenticationRepository');
const logger = require('../../Commons/utils/logger');

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  #pool;

  constructor(pool) {
    super();
    this.#pool = pool;
  }

  async addToken(token) {
    try {
      const query = {
        text: 'INSERT INTO authentications VALUES ($1)',
        values: [token],
      };
      await this.#pool.query('BEGIN');
      await this.#pool.query(query);
      await this.#pool.query('COMMIT');
    } catch (error) {
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
        method: 'addToken',
        trace: error,
      }, error.message);
      /* istanbul ignore next */await this.#pool.query('ROLLBACK');
    }
  }

  async checkAvailabilityToken(token) {
    const query = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.#pool.query(query).catch(/* istanbul ignore next */(error) => {
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
        method: 'checkAvailabilityToken',
        trace: error,
      }, error.message);
    });

    if (result.rows.length === 0) {
      /* istanbul ignore next */logger.debug({
        error: InvariantError.name,
      }, 'refresh token is invalid');
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  async deleteToken(token) {
    try {
      const query = {
        text: 'DELETE FROM authentications WHERE token = $1',
        values: [token],
      };
      await this.#pool.query('BEGIN');
      await this.#pool.query(query);
      await this.#pool.query('COMMIT');
    } catch (error) {
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
        method: 'deleteToken',
        trace: error,
      }, error.message);
      /* istanbul ignore next */await this.#pool.query('ROLLBACK');
    }
  }
}

module.exports = AuthenticationRepositoryPostgres;
