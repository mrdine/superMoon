const connection = require('../database/connection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const authConfig = require('../config/auth.json')
const tokenUtils = require('../utils/Token')
const mailer = require('../modules/mailer')
module.exports = {


    async create(request, response) {
        const { email, senha } = request.body

        const estabelecimentos = await connection('estabelecimentos')
            .select('email', 'senha')
            .where('email', email)

        const est = estabelecimentos[0]

        if (!est) {
            return response.status(400).json({ error: 'Este email não foi cadastrado' })
        }

        if (!await bcrypt.compare(senha, est.senha)) {
            return response.status(400).json({ error: 'Senha invalida' })
        }

        est.senha = undefined


        // acho que é assim, após fazer o login e o token ser gerado, o frontend leva o token até /profile
        response.send({
            est,
            token: tokenUtils.generateToken({ email: est.email })
        })
    },

    async trocarSenha(request, response) {
        const { email, senhaAtual, novaSenha } = request.body

        const estabelecimento = await connection('estabelecimentos')
            .select('email', 'senha')
            .where('email', email).first()

        if (!await bcrypt.compare(senhaAtual, estabelecimento.senha)) {
            return response.status(400).json({ error: 'Senha invalida' })
        }

        // trocar a senha
        await bcrypt.hash(novaSenha, 10)
            .then(async (hash) => {
                let senhaEncriptada = hash
                await connection('estabelecimentos').where('email', email).update('senha', senhaEncriptada)
                return response.send()  
            })

    },

    async recuperar(request, response) {
        const { email } = request.body

        try {
            const users = await connection('estabelecimentos')
                .select('email')
                .where('email', email)

            const user = users[0]


            if (!user) {
                return response.status(400).json({ error: 'Este email não foi cadastrado' })
            }

            const token = crypto.randomBytes(20).toString('hex')

            const now = new Date()
            now.setHours(now.getHours() + 1) // expiração

            await connection('estabelecimentos')
                .where('email', email)
                .update('senhaResetToken', token)
            await connection('estabelecimentos')
                .where('email', email)
                .update('senhaResetExpires', now.toISOString())

            console.log(token, now)
            mailer.sendMail({
                to: email,
                from: 'daniel.gomes071@gmail.com',
                template: 'recuperarsenha',
                context: { token },
            }, (err) => {
                if (err) {
                    console.log(err)
                    return response.status(400).send({ error: 'Não foi possivel enviar email de recuperação, tente novamente' })
                }
                return response.send('Ok')
            })


        } catch (error) {
            console.log(error)
            response.status(400).send({ error: 'Erro ao tentar recuperar senha, tente novamente' })
        }
    },

    async resetar(request, response) {
        const { email, token, senha } = request.body

        try {
            const users = await connection('estabelecimentos').select('senhaResetToken', 'senhaResetExpires')
                .where('email', email)
            const user = users[0]

            if (!user) {
                response.status(400).send({ error: 'Conta não encontrada' })
            }

            if (token !== user.senhaResetToken) {
                response.status(400).send({ error: 'Não foi possivel resetar a senha, gere um novo email de recuperação' })
            }

            const now = new Date()

            if (now > user.senhaResetExpires) {
                response.status(400).send({ error: 'Não foi possivel resetar a senha, token expirado, gere um novo email de recuperação' })
            }

            // salvar nova senha do usuario encriptada
            await bcrypt.hash(senha, 10)
                .then(async (hash) => {
                    let senhaEncriptada = hash

                    await connection('estabelecimentos')
                        .where('email', email)
                        .update('senha', senhaEncriptada)

                })

            response.send()

        } catch (err) {
            response.status(400).send({ error: 'Não foi possivel resetar a senha, tente novamente' })
        }
    }
}