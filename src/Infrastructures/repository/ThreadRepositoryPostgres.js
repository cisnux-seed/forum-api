const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const logger = require('../../Commons/utils/logger');

class ThreadRepositoryPostgres extends ThreadRepository {
  #pool;

  #idGenerator;

  constructor(pool, idGenerator) {
    super();
    this.#pool = pool;
    this.#idGenerator = idGenerator;
  }

  async addThread(addThread) {
    const { owner, title, body } = addThread;
    const id = `thread-${this.#idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES ($1,$2,$3,$4) RETURNING id, owner, title',
      values: [id, owner, title, body],
    };
    await this.#pool.query('BEGIN');
    const result = await this.#pool.query(query).catch(/* istanbul ignore next */async (error) => {
      /* istanbul ignore next */await this.#pool.query('ROLLBACK');
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
        method: 'addThread',
        trace: error,
      }, error.message);
    });
    await this.#pool.query('COMMIT');
    return new AddedThread(result.rows[0]);
  }

  async checkAvailabilityThread(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this.#pool.query(query).catch(/* istanbul ignore next */(error) => {
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
        method: 'checkAvailabilityThread',
        trace: error,
      }, error.message);
    });

    if (!result.rows.length) {
      /* istanbul ignore next */logger.debug({
        error: NotFoundError.name,
      }, "thread doesn't exist");
      throw new NotFoundError('thread tidak ditemukan di database');
    }
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT threads.id AS id, title, body, date, username 
      FROM threads INNER JOIN users ON threads.owner = users.id WHERE threads.id = $1`,
      values: [id],
    };

    const result = await this.#pool.query(query).catch(/* istanbul ignore next */(error) => {
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
        method: 'getThreadById',
        trace: error,
      }, error.message);
    });

    if (!result.rows.length) {
      /* istanbul ignore next */logger.debug({
        error: NotFoundError.name,
      }, "thread doesn't exist");
      throw new NotFoundError('thread tidak ditemukan di database');
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
