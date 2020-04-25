
exports.up = function(knex) {
    return knex.schema.createTable('imagens', function (table) {
        table.increments('id')

        table.boolean('perfil')
        table.binary('imagem').notNullable()

        table.string('estabelecimento').notNullable()

        table.foreign('estabelecimento').references('email').inTable('estabelecimentos')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('imagens')
  
};
