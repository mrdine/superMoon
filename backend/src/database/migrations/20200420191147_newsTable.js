
exports.up = function(knex) {
    return knex.schema.createTable('news', function (table) {
        table.increments()

        table.string('titulo').notNullable()
        table.date('data').notNullable()
        table.string('conteudo').notNullable()
        
        table.string('estabelecimento').notNullable()

        table.foreign('estabelecimento').references('email').inTable('estabelecimentos')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('news')
  
};
