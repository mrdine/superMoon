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

        estabelecimento.myImages = await connection('imagens')
            .select('id', 'imagem', 'perfil')
            .where({ estabelecimento: estabelecimento.email, perfil: false })

        estabelecimento.myPerfilImage = await connection('imagens')
            .select('imagem')
            .where({ estabelecimento: email, perfil: true }).first()


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

        estabelecimento.myImages = await connection('imagens')
            .select('id', 'imagem', 'perfil')
            .where({ estabelecimento: estabelecimento.email, perfil: false })

        estabelecimento.myPerfilImage = await connection('imagens')
            .select('imagem')
            .where({ estabelecimento: estabelecimento.email, perfil: true }).first()


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
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  


        const email = request.estEmail
        // DEFINIR A IMAGEM DE PERFIL
        const now = Date.now()
        const randomN = randomNumber.getRandomInt(0, 7777)
        const newName = `${now}${randomN}.png`

        const form = formidable({ uploadDir: `${assetsUtils.assetsDir}/temp/imagesUploaded` })

        try {
            form.parse(request, async function (err, fields, files) {
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
                            try {
                                resizeImage(newpath, newpath)

                            } catch (error) {
                                console.log('Erro ao redimensionar imagem', error)
                            }
                        })



                        try {

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




                        } catch (error) {
                            console.log(error, 'Erro ao inserir imagem')
                            return response.status(401).send({ error: 'Tente novamente' })
                        }

                        // excluir imagem da past temp
                        // excluir imagem não redimensionada
                        //fs.unlinkSync(pathProvisorio)
                        fs.unlinkSync(newpath)
                        // Agora testar recuperar imagem do bd
                        /*
                        const imagess = await connection('imagens').select('imagem').where({
                            estabelecimento: email,
                            perfil: true
                        })
                        const myimage = imagess[0]
                        const binaryimage = myimage.imagem
                        // decode binary data
                        fileConverter.base64_decode(binaryimage, `daniel${newName}`)
                        */
                    } else {
                        return response.status(401).send({ error: 'O arquivo deve ser uma imagem .jpg ou .png.' })
                    }
                }
                response.send()
            });

        } catch (error) {
            console.log(error, 'Erro ao pegar arquivo enviado')
        }


    },

    // DEVE TER UMA FUNÇÃO/ROTA SÓ PARA INSERIR E PARA DELETAR IMAGENS
    async adicionarFotos(request, response) {
        const email = request.estEmail


        const form = formidable({
            multiples: true,
            uploadDir: `${assetsUtils.assetsDir}/temp/imagesUploaded`
        })

        try {
            form.parse(request, async function (err, fields, files) {
                let arquivos = files
                // se for mais que uma imagem
                if (files.file.name === undefined) {
                    arquivos = files.file
                    arquivos.forEach(async (arquivo) => {
                        // verificar se arquivo é uma imagem
                        const fileNome = arquivo.name

                        const parts = fileNome.split('.')
                        if (!parts.length === 2) {
                            return response.status(401).send({ error: 'O nome do arquivo não deve conter caracteres especiais.' })
                        }

                        const [nome, extensao] = parts
                        if (extensao === 'png' || extensao === 'jpg') {
                            // renomear imagem
                            let now = Date.now()
                            let randomN = randomNumber.getRandomInt(0, 7777)
                            let newName = `${now}${randomN}.png`

                            const filepath = arquivo.path
                            const newpath = `${assetsUtils.assetsDir}/temp/imagesUploaded/${newName}`
                            fs.rename(filepath, newpath, async (err) => {
                                if (err) {
                                    console.log(err, 'erro ao renomear arquivo')
                                    return response.status(401).send({ error: 'Erro, tente novamente' })
                                }

                                // redimensionar imagem para 480x270
                                //await resizeImage([newpath], 480, 270)
                                //resizeImage.resizeImage2(newpath)

                                // adicionar imagem no bd
                                const binaryFile = await fileConverter.base64_encode(newName)
                                await connection('imagens').insert({
                                    perfil: false,
                                    imagem: binaryFile,
                                    estabelecimento: email
                                })
                                // excluir imagem da past temp
                                fs.unlinkSync(newpath)
                                return response.send()

                            })


                        } else {
                            return response.status(401).send({ error: 'Insira somente imagens .png ou .jpg' })
                        }





                    })
                }
                // se for só uma imagem
                else {
                    // verificar se arquivo é uma imagem
                    const fileNome = arquivos.file.name
                    const parts = fileNome.split('.')
                    if (!parts.length === 2) {
                        return response.status(401).send({ error: 'O nome do arquivo não deve conter caracteres especiais.' })
                    }

                    const [nome, extensao] = parts
                    if (extensao === 'png' || extensao === 'jpg') {
                        // renomear imagem
                        let now = Date.now()
                        let randomN = randomNumber.getRandomInt(0, 7777)
                        let newName = `${now}${randomN}.png`

                        const filepath = arquivos.file.path
                        const newpath = `${assetsUtils.assetsDir}/temp/imagesUploaded/${newName}`
                        fs.rename(filepath, newpath, async (err) => {
                            if (err) {
                                console.log(err, 'erro ao renomear arquivo')
                                return response.status(401).send({ error: 'Erro, tente novamente' })
                            }

                            const binaryFile = await fileConverter.base64_encode(newName)
                            // adicionar imagem no bd


                            await connection('imagens').insert({
                                perfil: false,
                                imagem: binaryFile,
                                estabelecimento: email
                            })
                            // excluir imagem da past temp
                            fs.unlinkSync(newpath)

                            return response.send()
                        })



                    } else {
                        return response.status(401).send({ error: 'Insira somente imagens .png ou .jpg' })
                    }

                }
            })
        } catch (error) {
            console.log(error, 'Erro ao tentar pegar arquivos enviados')
            response.status(401).send({ erro: 'Erro, tente novamente' })
        }

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