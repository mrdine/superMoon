const connection = require('../database/connection')
const bcrypt = require('bcrypt')
const fs = require('fs')
const rimraf = require('rimraf')
const assetsUtils = require('../../assets/assetsUtils')

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
        const { apelido, senha, senha2, nome, telefone, categoria, email, uf, cidade, bairro, rua, numero, complemento } = request.body

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
                    telefone,
                    senha: senhaEncriptada,
                    email,
                    categoria
                })

                /*
                // criar pasta para guardar imagens
                const dir = assetsUtils.assetsDir + `/estabelecimentos/${apelido}`
                if (!fs.existsSync()) {
                    try {
                        fs.mkdirSync(dir)
                    } catch (error) {
                        console.log('Erro ao criar pasta do estabelecimento', error)
                    }
                    
                }
                */

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



    },

    async delete(request, response) {
        const email = request.estEmail
        if(!email) {
            return response.status(401).json({ error: 'Tem que estar logado para deletar uma conta' }) // 401: Não autorizado
        }

        const estabelecimentos = await connection('estabelecimentos')
        .select('apelido')
        .where('email', email)
        const est = estabelecimentos[0]
        const apelido = est.apelido

        try {
            await connection('estabelecimentos')
                .where('email', email)
                .del()
            response.send()
            

           
        } catch (error) {
            console.log(error)
            return response.status(401).json({ error: 'Não foi possivel deletar, tente novamente' }) // 401: Não autorizado
        }
        /*
        const dir = assetsUtils.assetsDir + `/estabelecimentos/${apelido}`

        try {
             // deletar pasta criada daquele estabelecimento
            rimraf(dir, function () {
                console.log(`pasta '${dir}' deletada`)
            })

             response.send()
        } catch (error) {
            console.log(`Não foi possivel deletar pasta '${dir}' \n`, error)
            response.send()
        }
        */
    }
}