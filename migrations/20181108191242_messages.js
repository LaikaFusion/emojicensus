
exports.up = function(knex, Promise) {
  return knex.schema.createTable('messages', function (table) {
    table.increments();
    table.string("user").notNullable();
    table.text ("message").notNullable();
    table.text("reactions").notNullable();

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("messages");
};
