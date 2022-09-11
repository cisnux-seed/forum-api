const isUndefined = require('../../../Commons/utils/undefined_variable_validation');
const ReplyDetail = require('./CommentDetail');

class CommentReplyDetail {
  constructor(payload) {
    this.#verifyPayload(payload);

    const {
      id, content, date, username, replies, likeCount,
    } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.replies = replies;
    this.likeCount = likeCount;
  }

  #verifyPayload({
    id, content, date, username, replies, likeCount,
  }) {
    if (isUndefined(id) || isUndefined(content) || isUndefined(date)
    || isUndefined(username) || isUndefined(replies) || isUndefined(likeCount)) {
      throw new Error('COMMENT_REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'string'
    || typeof username !== 'string' || !Array.isArray(replies) || typeof likeCount !== 'string') {
      throw new Error('COMMENT_REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  static fromTable({
    id, content, date, username, replies, isDelete, likeCount,
  }) {
    return new CommentReplyDetail({
      id,
      content: !isDelete ? content : '**komentar telah dihapus**',
      date: date.toString(),
      username,
      replies: !isUndefined(replies) ? replies.map((reply) => ReplyDetail.fromTable(reply)) : [],
      likeCount,
    });
  }
}

module.exports = CommentReplyDetail;
