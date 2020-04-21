
exports.up = function(knex) {
    return knex.schema.createTable('perfis', function (table) {
        table.string('descricao')
        table.boolean('delivery')  
        table.string('imagens')
        table.string('estabelecimento').notNullable()

        table.foreign('estabelecimento').references('email').inTable('estabelecimentos')
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('perfis')
  };
  
  // para criar migration
  // 'npx knex migrate:make create_ongs'
  
  // para executar a migration
  // 'npx knex migrate:latest'
  
  // 'npx next' lista todos os comandos
  
  // 'npx knex migrate::rollback' desfaz a ultima migration