const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/comments/entities/AddedComment');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const logger = require('../../Commons/utils/logger');

class ReplyRepositoryPostgres extends ReplyRepository {
  #pool;

  #idGenerator;

  constructor(pool, idGenerator) {
    super();
    this.#pool = pool;
    this.#idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const {
      threadId,
      owner,
      commentId,
      content,
    } = addReply;
    const id = `reply-${this.#idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, owner, content',
      values: [commentId, id, owner, threadId, content],
    };
    await this.#pool.query('BEGIN');
    const result = await this.#pool.query(query).catch(async (error) => {
      await this.#pool.query('ROLLBACK');
      /* istanbul ignore else */if (error.code === '23503') {
        if (error.message.includes('"replies_thread_id_fkey"')) {
          /* istanbul ignore next */logger.debug({
            postgres_error_code: error.code,
            error: NotFoundError.name,
          }, "thread doesn't exist'");
          throw new NotFoundError('thread tidak ditemukan di database');
        } else /* istanbul ignore else */ if (error.message.includes('"replies_comment_id_fkey"')) {
          /* istanbul ignore next */logger.debug({
            postgres_error_code: error.code,
            error: NotFoundError.name,
          }, "comment doesn't exist");
          throw new NotFoundError('comment tidak ditemukan di database');
        }
        /* istanbul ignore next */logger.debug({
          postgres_error_code: error.code,
          error: 'Server Error',
        }, error.message);
      }
    });
    await this.#pool.query('COMMIT');
    return new AddedReply(result.rows[0]);
  }

  async checkAvailabilityReply(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this.#pool.query(query).catch(/* istanbul ignore next */(error) => {
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
        method: 'checkAvailabilityReply',
        trace: error,
      }, error.message);
    });

    /* istanbul ignore else */if (!result.rows.length) {
      /* istanbul ignore next */await this.#pool.query('ROLLBACK');
      /* istanbul ignore next */logger.debug({
        error: NotFoundError.name,
      }, "reply doesn't exist");
      throw new NotFoundError('reply tidak ditemukan di database');
    }
  }

  async verifyReplyOwner({ id, owner }) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this.#pool.query(query).catch(/* istanbul ignore next */(error) => {
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
        method: 'verifyReplyOwner',
        trace: error,
      }, error.message);
    });

    /* istanbul ignore else */if (result.rows.length === 0) {
      /* istanbul ignore next */logger.debug({
        error: AuthorizationError.name,
      }, "invalid owner can't delete reply");
      throw new AuthorizationError('anda tidak berhak menghapus reply');
    }
  }

  async deleteReplyById(id) {
    const isDelete = true;

    const query = {
      text: 'UPDATE replies SET is_delete = $1 WHERE id = $2',
      values: [isDelete, id],
    };

    await this.#pool.query('BEGIN');
    const result = await this.#pool.query(query).catch(/* istanbul ignore next */async (error) => {
      /* istanbul ignore next */await this.#pool.query('ROLLBACK');
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
        method: 'deleteReplyById',
        trace: error,
      }, error.message);
    });
    await this.#pool.query('COMMIT');
    if (!result.rowCount) {
      /* istanbul ignore next */logger.debug({
        error: NotFoundError.name,
      }, "reply doesn't exist");
      throw new NotFoundError('reply tidak ditemukan di database');
    }
  }

  async getRepliesByCommentIds(commentIds) {
    const query = {
      text: `SELECT replies.id AS id, content, date, username, comment_id AS "commentId", is_delete AS "isDelete"
      FROM replies INNER JOIN users ON replies.owner = users.id WHERE replies.comment_id = ANY($1) ORDER BY date ASC`,
      values: [commentIds],
    };

    const result = await this.#pool.query(query).catch(/* istanbul ignore next */(error) => {
      /* istanbul ignore next */logger.debug({
        postgres_error_code: error.code,
        error: 'Server Error',
        method: 'getRepliesByCommentIds',
        trace: error,
      }, error.message);
    });

    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
