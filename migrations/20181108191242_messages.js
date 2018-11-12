exports.up = function (knex) {
  return knex.schema.createTable('messages', (table) => {
    table.increments();
    table.string('user').notNullable();
    table.text('message').notNullable();
    table.text('reactions').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('messages');
};
