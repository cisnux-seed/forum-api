const isUndefined = require('../../../Commons/utils/undefined_variable_validation');

class CommentDetail {
  constructor(payload) {
    this.#verifyPayload(payload);

    const {
      id, content, date, username,
    } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
  }

  #verifyPayload({
    id, content, date, username,
  }) {
    if (isUndefined(id) || isUndefined(content) || isUndefined(date) || isUndefined(username)) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'string' || typeof username !== 'string') {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  static fromTable({
    id, content, date, username, isDelete,
  }) {
    return new CommentDetail({
      id,
      content: !isDelete ? content : '**balasan telah dihapus**',
      date,
      username,
      isDelete,
    });
  }
}

module.exports = CommentDetail;
