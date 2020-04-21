const connection = require('../database/connection')
const authMiddleware = require('../middlewares/auth')
// TEM QUE SER NO BODY
module.exports = {
    async index(request, response) {
        response.send({ ok: true, email: request.estEmail })
    }
}