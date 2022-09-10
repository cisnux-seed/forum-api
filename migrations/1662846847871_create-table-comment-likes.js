/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    user_id: {
      type: 'VARCHAR(50)',
      references: 'users',
    },
    comment_id: {
      type: 'VARCHAR(50)',
      references: 'comments',
    },
  });
  pgm.addConstraint('comment_likes', 'unique_user_id_and_comment_id', 'UNIQUE(user_id, comment_id)');
};

exports.down = (pgm) => {
  pgm.dropConstraint('comment_likes', 'unique_user_id_and_comment_id');
  pgm.dropTable('comment_likes');
};
