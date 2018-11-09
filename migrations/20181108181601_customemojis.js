
exports.up = function(knex, Promise) {
  return knex.schema.createTable('emojis', function (table) {
    table.increments();
    table.string("name").notNullable().unique();
    table.text ("location").notNullable();

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("emojis");

};
