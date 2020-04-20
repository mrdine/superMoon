
exports.up = function(knex) {
    return knex.schema.createTable('estabelecimentos', function (table) {
        table.string('usuario').primary()
        table.string('nome').notNullable()
        table.string('email').notNullable()
        table.string('senha').notNullable()
        table.string('categoria').notNullable()
  
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('estabelecimentos')
};
