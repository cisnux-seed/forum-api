/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable(
    'threads',
    {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      owner: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      title: {
        type: 'TEXT',
        notNull: true,
      },
      body: {
        type: 'TEXT',
        notNull: true,
      },
      date: {
        type: 'TIMESTAMP',
        notNull: true,
        default: pgm.func('current_timestamp'),
      },
    },
  );
  pgm.createIndex('threads', 'owner');
};

exports.down = (pgm) => {
  pgm.dropIndex('threads', 'owner');
  pgm.dropTable('threads');
};
