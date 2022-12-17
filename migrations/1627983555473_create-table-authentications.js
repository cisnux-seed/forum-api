/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('authentications', {
    token: {
      type: 'TEXT',
      notNull: true,
      primaryKey: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('authentications');
};
