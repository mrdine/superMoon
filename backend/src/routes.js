const express = require('express')

const EstController = require('./controllers/EstController')
const SessionController = require('./controllers/SessionController')
const ProfileController = require('./controllers/ProfileController')
const authMiddleware = require('./middlewares/auth')



const routes = express.Router()

routes.get('/', (request, response) => {
    
})

routes.get('/estabelecimentos', EstController.index)
routes.post('/cadastrar_estabelecimento', EstController.create)

routes.post('/login', SessionController.create)
routes.post('/recuperar_senha', SessionController.recuperar)
routes.post('/recuperar_senha/resetar_senha', SessionController.resetar)

routes.get('/profile', authMiddleware, ProfileController.index)



module.exports = routes
