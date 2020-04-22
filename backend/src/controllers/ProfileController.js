const connection = require('../database/connection')
const authMiddleware = require('../middlewares/auth')

module.exports = {
    async index(request, response) {
        const estabelecimento = {}
        estabelecimento.email = request.estEmail

        const estabelecimentos = await connection('estabelecimentos')
            .select('nome', 'apelido', 'email', 'telefone', 'categoria')
            .where('email', estabelecimento.email)
        estabelecimento.myEstabelecimento = estabelecimentos[0]

        const enderecos = await connection('enderecos')
            .select('uf', 'cidade', 'bairro', 'rua', 'numero', 'complemento')
            .where('estabelecimento', estabelecimento.email)
        estabelecimento.myEndereco = enderecos[0]

        const perfis = await connection('perfis')
            .select('descricao', 'delivery', 'imagens')
            .where('estabelecimento', estabelecimento.email)
        estabelecimento.myPerfil = perfis[0]

        estabelecimento.myNews = await connection('news')
            .select('titulo', 'data', 'conteudo')
            .where('estabelecimento', estabelecimento.email)

        response.send( estabelecimento )
    },

    async indexEditar(request, response) {
        const estabelecimento = {}
        estabelecimento.email = request.estEmail

        const estabelecimentos = await connection('estabelecimentos')
            .select('nome', 'apelido', 'email', 'telefone', 'categoria')
            .where('email', estabelecimento.email)
        estabelecimento.myEstabelecimento = estabelecimentos[0]

        const enderecos = await connection('enderecos')
            .select('uf', 'cidade', 'bairro', 'rua', 'numero', 'complemento')
            .where('estabelecimento', estabelecimento.email)
        estabelecimento.myEndereco = enderecos[0]

        const perfis = await connection('perfis')
            .select('descricao', 'delivery', 'imagens')
            .where('estabelecimento', estabelecimento.email)
        estabelecimento.myPerfil = perfis[0]

        response.send( estabelecimento )

    },

    async editar(request, response) {
        // nome, telefone, categoria // todo o endereço // descricao e delivery
        const { nome, telefone, categoria, uf, cidade, bairro, rua, numero, complemento, descricao, delivery } = request.body
        const email = request.estEmail
        try {
            // estabelecimento / conta
            await connection('estabelecimentos')
                .where('email', email)
                .update('nome', nome)
            await connection('estabelecimentos')
                .where('email', email)
                .update('telefone', telefone)
             await connection('estabelecimentos')
                .where('email', email)
                .update('categoria', categoria)
            
            // endereco
            await connection('enderecos')
                .where('estabelecimento', email)
                .update('uf', uf)
                await connection('enderecos')
                .where('estabelecimento', email)
                .update('cidade', cidade)
                await connection('enderecos')
                .where('estabelecimento', email)
                .update('bairro', bairro)
                await connection('enderecos')
                .where('estabelecimento', email)
                .update('rua', rua)
                await connection('enderecos')
                .where('estabelecimento', email)
                .update('numero', numero)
                await connection('enderecos')
                .where('estabelecimento', email)
                .update('complemento', complemento)

            await connection('perfis')
                .where('estabelecimento', email)
                .update('descricao', descricao)
                await connection('perfis')
                .where('estabelecimento', email)
                .update('delivery', delivery)

            // FALTA DEFINIR A IMAGEM DE PERFIL
                
            response.send()
        } catch (error) {
            console.log(error)
            return response.status(401).json({ error: 'Insira os dados corretamente' }) // 401: Não autorizado
        }
    },

    // DEVE TER UMA FUNÇÃO/ROTA SÓ PARA INSERIR E PARA DELETAR IMAGENS
}