exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('uid').unique();
    table.string('name');
    table.string('real_name');
    table.string('topemojiarray');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
