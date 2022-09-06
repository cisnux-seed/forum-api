const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const logger = require('../../Commons/utils/logger');

class CommentRepositoryPostgres extends CommentRepository {
  #pool;

  #idGenerator;

  constructor(pool, idGenerator) {
    super();
    this.#pool = pool;
    this.#idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const {
      threadId,
      owner,
      content,
    } = addComment;
    const id = `comment-${this.#idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES ($1,$2,$3,$4) RETURNING id, owner, content',
      values: [id, owner, threadId, content],
    };

    await this.#pool.query('BEGIN');
    const result = await this.#pool.query(query).catch(async (error) => {
      await this.#pool.query('ROLLBACK');
      /* istanbul ignore else */if (error.code === '23503') {
        /* istanbul ignore next */logger.debug({
          postgres_error_code: error.code,
          error: NotFoundError.name,
        }, "thread doesn't exist");
        throw new NotFoundError('thread tidak ditemukan di database');
      }
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
      }, error.message);
    });
    await this.#pool.query('COMMIT');
    return new AddedComment(result.rows[0]);
  }

  async checkAvailabilityComment(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this.#pool.query(query).catch(/* istanbul ignore next */(error) => {
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
      }, error.message);
    });

    /* istanbul ignore else */if (!result.rows.length) {
      /* istanbul ignore next */await this.#pool.query('ROLLBACK');
      /* istanbul ignore next */logger.debug({
        error: NotFoundError.name,
      }, "comment doesn't exist");
      throw new NotFoundError('comment tidak ditemukan di database');
    }
  }

  async verifyCommentOwner({ id, owner }) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this.#pool.query(query).catch(/* istanbul ignore next */(error) => {
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
      }, error.message);
    });

    /* istanbul ignore else */if (!result.rows.length) {
      /* istanbul ignore next */logger.debug({
        error: AuthorizationError.name,
      }, "invalid owner can't delete comment");
      throw new AuthorizationError('anda tidak berhak menghapus comment');
    }
  }

  async deleteCommentById(id) {
    const isDelete = true;

    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2',
      values: [isDelete, id],
    };

    await this.#pool.query('BEGIN');
    await this.#pool.query(query).catch(/* istanbul ignore next */async (error) => {
      /* istanbul ignore next */await this.#pool.query('ROLLBACK');
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
      }, error.message);
    });
    await this.#pool.query('COMMIT');
  }
}

module.exports = CommentRepositoryPostgres;
