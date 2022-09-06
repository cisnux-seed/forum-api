const isUndefined = require('../../../Commons/utils/undefined_variable_validation');
const CommentReplyDetail = require('../../comments/entities/CommentReplyDetail');

class ThreadDetail {
  constructor(payload) {
    this.#verifyPayload(payload);

    const {
      id, title, body, date, username, comments,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  #verifyPayload({
    id, title, body, date, username, comments,
  }) {
    if (isUndefined(id) || isUndefined(title) || isUndefined(body)
    || isUndefined(date) || isUndefined(username) || isUndefined(comments)) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string'
    || typeof body !== 'string' || typeof date !== 'string'
    || typeof username !== 'string' || !Array.isArray(comments)) {
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  static fromTable({
    id, title, body, date, username, comments,
  }) {
    return new ThreadDetail(
      {
        id,
        title,
        body,
        date: date.toString(),
        username,
        comments: !isUndefined(comments)
          ? comments.map((comment) => CommentReplyDetail.fromTable(comment)) : [],
      },
    );
  }
}

module.exports = ThreadDetail;
