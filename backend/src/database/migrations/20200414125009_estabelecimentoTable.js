
exports.up = function(knex) {
    return knex.schema.createTable('estabelecimentos', function (table) {
        table.string('apelido').notNullable()
        table.string('nome').notNullable()
        table.string('email').primary()
        table.string('senha').notNullable()
        table.string('categoria').notNullable()

        table.string('senhaResetToken')
        table.date('senhaResetExpires')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('estabelecimentos')
};
