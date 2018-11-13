exports.up = function (knex, Promise) {
  return knex.schema.createTable('emojis', (table) => {
    table.increments();
    table
      .string('name')
      .notNullable()
      .unique();
    table.text('location').notNullable();
    table.integer('uses');
    table.string('topuser');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('emojis');
};
