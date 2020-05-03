const connection = require('../database/connection')

module.exports = {
    async create(request, response) {
        const email = request.estEmail
        const { titulo, conteudo } = request.body
        const now = new Date()

        try {
            await connection('news').insert({
                estabelecimento: email,
                titulo,
                conteudo,
                data: now.toISOString()
            })

            response.send()
        } catch (error) {
            console.log('não foi possivel cadastrar noticia', error)
            return response.status(401).json({ error: 'Erro, tente novamente' }) // 401: Não autorizado
        }
        
    },

    async delete(request, response) {
        const email = request.estEmail
        const id = request.params.id
        try {
            await connection('news').where('id', id).del()
        } catch (error) {
            console.log(error)
        }

        response.send()
    }
}