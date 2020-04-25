const express = require('express')

const EstController = require('./controllers/EstController')
const SessionController = require('./controllers/SessionController')
const ProfileController = require('./controllers/ProfileController')
const authMiddleware = require('./middlewares/auth')
const NewsController = require('./controllers/NewsController')

const views = require('./views/views')

const routes = express.Router()


// pagina de um perfil '/?apelido=bla'
routes.get('/profile/', ProfileController.indexProfile)

routes.get('/estabelecimentos', EstController.index)
routes.post('/cadastrar_estabelecimento', EstController.create)
routes.delete('/excluir_estabelecimento', authMiddleware, EstController.delete)

routes.post('/login', SessionController.create)
routes.post('/recuperar_senha', SessionController.recuperar)
routes.post('/recuperar_senha/resetar_senha', SessionController.resetar)

routes.get('/profile', authMiddleware, ProfileController.index)
routes.get('/profile/editar', authMiddleware, ProfileController.indexEditar)
// tenho que usar o get acima para colocar os values no form no react
routes.post('/profile/editar', authMiddleware, ProfileController.editar)
routes.post('/profile/editar_perfil_image', authMiddleware, ProfileController.editarImagePerfil)
routes.post('/profile/adicionar_fotos', authMiddleware , ProfileController.adicionarFotos)
routes.delete('/profile/deletar_foto/:id', authMiddleware, ProfileController.deletarFoto)


routes.post('/profile/news', authMiddleware, NewsController.create)


module.exports = routes
