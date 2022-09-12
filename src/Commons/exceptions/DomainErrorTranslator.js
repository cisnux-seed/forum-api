const InvariantError = require('./InvariantError');

class DomainErrorTranslator {
  static #directories = {
    'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
    'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
    'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
    'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
    'REGISTER_USER.EMPTY_FULLNAME': new InvariantError('fullname tidak boleh kosong'),
    'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread karena properti yang dibutuhkan tidak ada'),
    'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('owner, title, body harus string'),
    'ADD_THREAD.EMPTY_OWNER': new InvariantError('owner tidak boleh kosong'),
    'ADD_THREAD.EMPTY_TITLE': new InvariantError('title tidak boleh kosong'),
    'ADD_THREAD.EMPTY_BODY': new InvariantError('body tidak boleh kosong'),
    'ADD_THREAD.OWNER_LIMIT_CHAR': new InvariantError(''),
    'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'),
    'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('owner, thread id, dan content harus string'),
    'ADD_COMMENT.EMPTY_OWNER': new InvariantError('owner tidak boleh kosong'),
    'ADD_COMMENT.EMPTY_THREAD_ID': new InvariantError('thread id tidak boleh kosong'),
    'ADD_COMMENT.EMPTY_CONTENT': new InvariantError('content tidak boleh kosong'),
    'ADD_COMMENT.OWNER_LIMIT_CHAR': new InvariantError('owner melebihi batas limit'),
    'ADD_COMMENT.THREAD_ID_LIMIT_CHAR': new InvariantError('thread id melebihi batas limit'),
    'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment reply karena properti yang dibutuhkan tidak ada'),
    'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('threadId, commentId, owner, dan content harus string'),
    'ADD_REPLY.EMPTY_OWNER': new InvariantError('owner tidak boleh kosong'),
    'ADD_REPLY.EMPTY_THREAD_ID': new InvariantError('thread id tidak boleh kosong'),
    'ADD_REPLY.EMPTY_COMMENT_ID': new InvariantError('comment id tidak boleh kosong'),
    'ADD_REPLY.EMPTY_CONTENT': new InvariantError('content tidak boleh kosong'),
    'ADD_REPLY.OWNER_LIMIT_CHAR': new InvariantError('owner melebihi batas limit'),
    'ADD_REPLY.THREAD_ID_LIMIT_CHAR': new InvariantError('thread id melebihi batas limit'),
    'ADD_REPLY.COMMENT_ID_LIMIT_CHAR': new InvariantError('comment id melebihi batas limit'),
    'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
    'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
    'NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan access token dan refresh token'),
    'NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('access token dan refresh token harus string'),
    'NEW_AUTH.EMPTY_REFRESH_TOKEN': new InvariantError('refresh token tidak boleh kosong'),
    'NEW_AUTH.EMPTY_ACCESS_TOKEN': new InvariantError('access token tidak boleh kosong'),
    'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
    'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
    'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_IS_EMPTY': new InvariantError('refresh token tidak boleh kosong'),
    'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
    'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
    'DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menghapus comment karena properti yang dibutuhkan tidak ada'),
    'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('id, owner, dan thread id harus string'),
    'DELETE_COMMENT.EMPTY_ID': new InvariantError('id tidak boleh kosong'),
    'DELETE_COMMENT.EMPTY_OWNER': new InvariantError('owner tidak boleh kosong'),
    'DELETE_COMMENT.EMPTY_THREAD_ID': new InvariantError('thread id tidak boleh kosong'),
    'DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menghapus reply karena properti yang dibutuhkan tidak ada'),
    'DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('id, owner, thread id, dan comment id harus string'),
    'DELETE_REPLY.EMPTY_ID': new InvariantError('id tidak boleh kosong'),
    'DELETE_REPLY.EMPTY_COMMENT_ID': new InvariantError('comment id tidak boleh kosong'),
    'DELETE_REPLY.EMPTY_THREAD_ID': new InvariantError('thread id tidak boleh kosong'),
    'DELETE_REPLY.EMPTY_OWNER': new InvariantError('owner tidak boleh kosong'),
    'COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahkan like karen properti yang dibutuhkan tidak ada'),
    'COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('threadId, userId, dan commentId harus string'),
    'COMMENT_LIKE.EMPTY_ID': new InvariantError('comment id tidak boleh kosong'),
    'COMMENT_LIKE.EMPTY_THREAD_ID': new InvariantError('thread id tidak boleh kosong'),
    'COMMENT_LIKE.EMPTY_USER_ID': new InvariantError('user id tidak boleh kosong'),
  };

  static translate(error) {
    return this.#directories[error.message] || error;
  }
}

module.exports = DomainErrorTranslator;
