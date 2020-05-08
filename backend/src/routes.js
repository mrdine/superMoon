const express = require('express')

const EstController = require('./controllers/EstController')
const SessionController = require('./controllers/SessionController')
const ProfileController = require('./controllers/ProfileController')
const authMiddleware = require('./middlewares/auth')
const NewsController = require('./controllers/NewsController')

const views = require('./views/views')

const routes = express.Router()


// pagina de um perfil '/?apelido=bla'
routes.get('/:apelido', ProfileController.indexProfile)

routes.get('/buscar/estabelecimentos', EstController.index)
routes.post('/buscar/estabelecimentos_pertos', EstController.estPertos)

//buscar est por email
routes.post('/buscar/estabelecimentoEmail', EstController.estEmail)
// buscar est por apelido
routes.post('/buscar/estabelecimentoApelido', EstController.estApelido)

routes.post('/cadastrar_estabelecimento', EstController.create)
routes.delete('/excluir_estabelecimento', authMiddleware, EstController.delete)

routes.post('/login', SessionController.create)
routes.post('/trocar_senha', authMiddleware, SessionController.trocarSenha)
routes.post('/recuperar_senha', SessionController.recuperar)
routes.post('/recuperar_senha/resetar_senha', SessionController.resetar)

routes.get('/perfil/meu_perfil', authMiddleware, ProfileController.index)
routes.post('/perfil/imagens', ProfileController.getFotos)
routes.get('/perfil/my_news', authMiddleware, ProfileController.getNews)
routes.get('/perfil/news/:apelido', ProfileController.getNewsVisitante)

routes.get('/perfil/editar', authMiddleware, ProfileController.indexEditar)
// tenho que usar o get acima para colocar os values no form no react
routes.post('/perfil/editar', authMiddleware, ProfileController.editar)

routes.options('/perfil/editar_perfil_image')
routes.post('/perfil/editar_perfil_image', authMiddleware, ProfileController.editarImagePerfil)
routes.options('/perfil/adicionar_fotos', authMiddleware, ProfileController.adicionarFotos)
routes.post('/perfil/adicionar_fotos', authMiddleware , ProfileController.adicionarFotos)
routes.delete('/perfil/deletar_foto/:id', authMiddleware, ProfileController.deletarFoto)


routes.post('/perfil/news', authMiddleware, NewsController.create)
routes.delete('/perfil/deletar_news/:id', authMiddleware, NewsController.delete)

// testes
//routes.get('/perfil/foto_perfil', authMiddleware, ProfileController.getFoto)

module.exports = routes
