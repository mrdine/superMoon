
exports.up = function(knex) {
    return knex.schema.createTable('enderecos', function (table) {
        table.string('cidade').notNullable()
        table.string('bairro').notNullable()
        table.string('rua').notNullable()
        table.integer('numero')
        table.string('uf', 2).notNullable()
        table.string('complemento')
        table.string('estabelecimento')

        table.foreign('estabelecimento').references('usuario').inTable('estabelecimentos')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('enderecos')
  
};
