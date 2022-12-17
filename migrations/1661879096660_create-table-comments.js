/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable(
    'comments',
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
      thread_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: 'threads',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      content: {
        type: 'TEXT',
        notNull: true,
      },
      date: {
        type: 'TIMESTAMP',
        notNull: true,
        default: pgm.func('current_timestamp'),
      },
      is_delete: {
        type: 'BOOLEAN',
        notNull: true,
        default: false,
      },
    },
  );
  pgm.createIndex('comments', ['owner', 'thread_id']);
};

exports.down = (pgm) => {
  pgm.dropIndex('comments', ['owner', 'thread_id']);
  pgm.dropTable('comments');
};
