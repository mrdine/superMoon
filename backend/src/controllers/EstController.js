const connection = require('../database/connection')

module.exports = {

    async index (request, response) {
        const estabelecimentos = await connection('estabelecimentos').select('*')
        return response.json(estabelecimentos)
    },

    async create(request, response) {
        const { usuario, senha, categoria, email, uf, cidade, bairro, rua, numero, complemento } = request.body

        await connection('estabelecimentos').insert({
            usuario,
            senha,
            email,
            categoria
        })

        await connection('enderecos').insert({
            estabelecimento: usuario,
            uf,
            cidade,
            bairro,
            rua,
            numero,
            complemento
        })

        return response.json({ usuario })
    }
}