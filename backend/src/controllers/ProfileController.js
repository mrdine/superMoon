const connection = require('../database/connection')
const authMiddleware = require('../middlewares/auth')
const formidable = require('formidable')
const assetsUtils = require('../../assets/assetsUtils')
const fs = require('fs')
const randomNumber = require('../utils/RandomNumber')
const fileConverter = require('../utils/FileConverter')
const resizeImage = require('../utils/ResizeImage')

module.exports = {
    async index(request, response) {
        const email = request.estEmail

        const estabelecimento = await connection('estabelecimentos')
            .select('nome', 'apelido', 'email', 'telefone', 'categoria')
            .where('email', email)
            .first()

        estabelecimento.myEndereco = await connection('enderecos')
            .select('uf', 'cidade', 'bairro', 'rua', 'numero', 'complemento')
            .where('estabelecimento', email)
            .first()

        estabelecimento.myPerfil = await connection('perfis')
            .select('descricao', 'delivery')
            .where('estabelecimento', email)
            .first()

            let fotos = await connection('imagens')
            .select('id', 'imagem', 'perfil')
            .where({ estabelecimento: estabelecimento.email, perfil: false })

        fotos.forEach(async (foto, index) => {
            foto.imagem = await new Buffer.from(foto.imagem).toString()
        })

        estabelecimento.myImages = fotos
        console.log(fotos)

        estabelecimento.myPerfilImage = await connection('imagens')
            .select('imagem')
            .where({ estabelecimento: email, perfil: true }).first()


        estabelecimento.myPerfilImage.imagem = await new Buffer.from(estabelecimento.myPerfilImage.imagem).toString();

        response.send(estabelecimento)
    },

    async getNews(request, response) {
        const email = request.estEmail
        if (!email) {
            return response.status(401).send('Insira email')
        }
        const news = await connection('news').select('*').where('estabelecimento', email)

        response.send(news)
    },

    async getNewsVisitante(request, response) {
        let apelido = request.query.apelido
        if (!apelido) {
            apelido = request.params.apelido
        }

        const estabelecimento = await connection('estabelecimentos').select('email').where('apelido', apelido).first()

        const email = estabelecimento.email
        if (!email) {
            return response.status(401).send('Insira email')
        }
        const news = await connection('news').select('*').where('estabelecimento', email)

        response.send(news)
    },

    // Quando alguem visita a pagina de perfil
    async indexProfile(request, response) {
        let apelido = request.query.apelido
        if (!apelido) {
            apelido = request.params.apelido
        }
        const estabelecimento = await connection('estabelecimentos')
            .select('nome', 'apelido', 'email', 'telefone', 'categoria')
            .where('apelido', apelido)
            .first()

        estabelecimento.myEndereco = await connection('enderecos')
            .select('uf', 'cidade', 'bairro', 'rua', 'numero', 'complemento')
            .where('estabelecimento', estabelecimento.email)
            .first()

        estabelecimento.myPerfil = await connection('perfis')
            .select('descricao', 'delivery')
            .where('estabelecimento', estabelecimento.email)
            .first()

        let fotos = await connection('imagens')
            .select('id', 'imagem', 'perfil')
            .where({ estabelecimento: estabelecimento.email, perfil: false })

        fotos.forEach(async (foto, index) => {
            foto.imagem = await new Buffer.from(foto.imagem).toString()
        })

        estabelecimento.myImages = fotos
        console.log(fotos)

        estabelecimento.myPerfilImage = await connection('imagens')
            .select('imagem')
            .where({ estabelecimento: estabelecimento.email, perfil: true }).first()

        estabelecimento.myPerfilImage.imagem = await new Buffer.from(estabelecimento.myPerfilImage.imagem).toString();


        response.send(estabelecimento)


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

        response.send(estabelecimento)

    },

    async editar(request, response) {
        // nome, telefone, categoria // todo o endereço // descricao e delivery
        const { nome, telefone, categoria, uf, cidade, bairro, rua, numero, complemento, descricao, delivery, perfilImage } = request.body
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


            response.send()
        } catch (error) {
            console.log(error)
            return response.status(401).json({ error: 'Insira os dados corretamente' }) // 401: Não autorizado
        }
    },

    async editarImagePerfil(request, response) {
        const email = request.estEmail
        const { file, name } = request.body
        // verificar se é mesmo uma imagem
        const partsImage = name.split('.')
        if (partsImage[1] !== 'jpg' && partsImage[1] !== 'png') {
            response.send()
        }

        try {
            // Não vou mais redimensionar a imagem aqui
            /*
        // criar arquivo recebido
        let firstpath = `${assetsUtils.assetsDir}/temp/imagesUploaded/`
        const now = Date.now()
        const randomN = randomNumber.getRandomInt(0, 7777)
        const newName = `${now}${randomN}.png`
        await fileConverter.base64_decode(file, newName, firstpath)
        // redimensionar ele
        try {
            resizeImage(`${firstpath}${newName}`, `${firstpath}${newName}`)
            
        } catch (error) {
           console.log( error) 
           console.log('Erro ao redimensionar arquivo', error) 
        }

        */
            // primeiro ver se já nao tem imagem de perfil
            const imagens = await connection('imagens').select('perfil').where({
                estabelecimento: email,
                perfil: true
            })
            if (imagens.length > 0) {
                await connection('imagens').where({
                    estabelecimento: email,
                    perfil: true
                }).del()
            }
            // inserir no banco de dados

            //const binaryFile = await fileConverter.base64_encode(newName)
            await connection('imagens').insert({
                perfil: true,
                imagem: file,
                estabelecimento: email
            })

            // excluir imagem
            //fs.unlinkSync(`${firstpath}${newName}`)

            response.send()

        } catch (error) {
            console.log(error)
            return response.status(401).send({ error: 'Tente novamente.' })
        }

        /*
                const email = request.estEmail
                // DEFINIR A IMAGEM DE PERFIL
                const now = Date.now()
                const randomN = randomNumber.getRandomInt(0, 7777)
                const newName = `${now}${randomN}.png`
        
                const form = formidable({ uploadDir: `${assetsUtils.assetsDir}/temp/imagesUploaded` })
                try {
                    
                        form.parse(request, async function (err, fields, files) {
                            console.log(files)
                            if (files) {
                                // se for foto
                                const fileName = files.file.name
                                const parts = fileName.split('.')
                                if (!parts.length === 2) {
                                    return response.status(401).send({ error: 'O nome do arquivo não deve conter caracteres especiais.' })
                                }
            
                                const [nome, extensao] = parts
                                if (extensao === 'png' || extensao === 'jpg') {
                                    // renomear foto antes de enviar pro bd
                                    const filepath = files.file.path
                                    const pathProvisorio = `${assetsUtils.assetsDir}/temp/imagesUploaded/resize${newName}`
                                    const newpath = `${assetsUtils.assetsDir}/temp/imagesUploaded/${newName}`
            
                                    await fs.rename(filepath, newpath, (err) => {
                                        if (err) {
                                            console.log(err, 'erro ao renomear arquivo')
                                            return response.status(401).send({ error: 'Erro, tente novamente' })
                                        }
                                        
                                            resizeImage(newpath, newpath)
            
                                         
                                    })
            
            
            
                                    
            
                                        // primeiro ver se já nao tem imagem de perfil
                                        const imagens = await connection('imagens').select('perfil').where({
                                            estabelecimento: email,
                                            perfil: true
                                        })
                                        if (imagens.length > 0) {
                                            await connection('imagens').where({
                                                estabelecimento: email,
                                                perfil: true
                                            }).del()
                                        }
                                        // adicionar imagem no bd
                                        const binaryFile = await fileConverter.base64_encode(newName)
                                        await connection('imagens').insert({
                                            perfil: true,
                                            imagem: binaryFile,
                                            estabelecimento: email
                                        })
            
            
            
            
                                    
            
                                    // excluir imagem da past temp
                                    // excluir imagem não redimensionada
                                    //fs.unlinkSync(pathProvisorio)
                                    fs.unlinkSync(newpath)
                                    // Agora testar recuperar imagem do bd
                                   
                                } else {
                                    return response.status(401).send({ error: 'O arquivo deve ser uma imagem .jpg ou .png.' })
                                }
                            }
                            response.send()
                        });
            
                    
                } catch (error) {
                    console.log(error)
                }
                
        
        */
    },

    // DEVE TER UMA FUNÇÃO/ROTA SÓ PARA INSERIR E PARA DELETAR IMAGENS
    async adicionarFotos(request, response) {
        const email = request.estEmail
        const { file, name } = request.body
        // verificar se é mesmo uma imagem
        const partsImage = name.split('.')
        if (partsImage[1] !== 'jpg' && partsImage[1] !== 'png') {
            response.send()
        }
        // adicionar no bd
        await connection('imagens').insert({
            perfil: false,
            imagem: file,
            estabelecimento: email
        })

        response.send()

    },

    async deletarFoto(request, response) {
        const id = request.params.id
        const email = request.estEmail

        const image = await connection('imagens').where({ id: id, estabelecimento: email }).select('id', 'estabelecimento').first()

        if (image.estabelecimento === email) {
            await connection('imagens').where('id', id).delete()

            return response.send({ message: 'success' }) // 204: No content
        }

        return response.status(401).json({ error: 'Operation not permited' }) // 401: Não autorizado



    },

    async getFotos(request, response) {
        const email = request.body
        const imagens = await connection('imagens').select('id', 'imagem', 'perfil').where('estabelecimento', email)
        return response.send(imagens)
    },

    async getFoto(request, response) {
        const email = request.estEmail
        const binary = await connection('imagens').where({ estabelecimento: email, perfil: true }).select('imagem', 'perfil').first()
        fileConverter.base64_decode(binary.imagem, 'redimensonado.png')
        return response.send('oi')

    }


}