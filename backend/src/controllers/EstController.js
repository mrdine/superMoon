const connection = require('../database/connection')
const bcrypt = require('bcrypt')

module.exports = {

    async index(request, response) {
        const estabelecimentos = await connection('estabelecimentos').select('*')
        
        estabelecimentos.forEach((est) => {
            est.senha = undefined
            est.senhaResetToken = undefined
            est.senhaResetExpires = undefined
        })

        return response.json(estabelecimentos)
    },

    async create(request, response) {
        const { apelido, senha, senha2, nome, categoria, email, uf, cidade, bairro, rua, numero, complemento } = request.body

        // verificar se email já nao foi cadastrado antes
        let est = await connection('estabelecimentos').where('email', email)

        if (est.length !== 0) {
            return response.status(401).json({ error: 'Uma conta com este email já foi criada' }) // 401: Não autorizado
        }

        // verificar se apelido já nao foi cadastrado antes
        est = await connection('estabelecimentos').where('apelido', apelido)

        if (est.length !== 0) {
            return response.status(401).json({ error: 'Uma conta com este apelido já foi criada' }) // 401: Não autorizado
        }

        if ( senha !== senha2) {
            return response.status(401).json({ error: 'As senhas não conferem' }) // 401: Não autorizado
        }

        await bcrypt.hash(senha, 10)
            .then(async (hash) => {
                let senhaEncriptada = hash

                await connection('estabelecimentos').insert({
                    apelido,
                    nome,
                    senha: senhaEncriptada,
                    email,
                    categoria
                })

            })


        await connection('enderecos').insert({
            estabelecimento: email,
            uf,
            cidade,
            bairro,
            rua,
            numero,
            complemento
        })

        await connection('perfis').insert({
            estabelecimento: email
        })

        return response.json({ nome })



    }
}