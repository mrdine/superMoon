const express = require('express')

const EstController = require('./controllers/EstController')


const routes = express.Router()

routes.get('/', (request, response) => {
    
})

routes.get('/estabelecimentos', EstController.index)
routes.post('/cadastrarEstabelecimento', EstController.create)



module.exports = routes
