const CommentLikeRepository = require('../../Domains/comment_likes/CommentLikeRepository');
const logger = require('../../Commons/utils/logger');

class CommentRepositoryPostgres extends CommentLikeRepository {
  #pool;

  constructor(pool) {
    super();
    this.#pool = pool;
  }

  async addLikeById({ id, userId }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1,$2) ON CONFLICT DO NOTHING',
      values: [userId, id],
    };
    await this.#pool.query('BEGIN');
    const result = await this.#pool.query(query).catch(/* istanbul ignore next */async (error) => {
      /* istanbul ignore next */ await this.#pool.query('ROLLBACK');
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
        method: 'addLikeById',
        trace: error,
      }, error.message);
    });
    await this.#pool.query('COMMIT');
    return result.rowCount;
  }

  async deleteLikeById({ id, userId }) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [id, userId],
    };
    await this.#pool.query('BEGIN');
    await this.#pool.query(query).catch(/* istanbul ignore next */async (error) => {
      /* istanbul ignore next */await this.#pool.query('ROLLBACK');
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
        method: 'deleteLikeById',
        trace: error,
      }, error.message);
    });
    await this.#pool.query('COMMIT');
  }
}

module.exports = CommentRepositoryPostgres;
