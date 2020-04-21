const connection = require('../database/connection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authConfig = require('../config/auth.json')
const tokenUtils = require('../utils/Token')

module.exports = {


    async create(request, response) {
        const { email, senha } = request.body

        const estabelecimentos = await connection('estabelecimentos')
            .select('email', 'senha')
            .where('email', email)
        
        const est = estabelecimentos[0]    

        if(!est) {
            return response.status(400).json({ error: 'Este email não foi cadastrado' })
        }

        if(!await bcrypt.compare(senha, est.senha)) {
            return response.status(400).json({ error: 'Senha invalida' })
        }

        est.senha = undefined

        
        // acho que é assim, após fazer o login e o token ser gerado, o frontend leva o token até /profile
        response.send( { 
            est,
            token: tokenUtils.generateToken({ email: est.email }) } )
    }
}