/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addLikeById({ userId = 'user-123', id = 'comment-123' }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2)',
      values: [userId, id],
    };
    await pool.query(query);
  },
  async findCommentLikeById({ userId = 'user-123', id = 'comment-123' }) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [id, userId],
    };
    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM comment_likes WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
