const express = require('express')
const routes = require('./routes')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()


app.use(cors({ origin: `https://supermoonn.herokuapp.com`, allowedHeaders: ['Content-Type', 'Authorization']}))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes)

module.exports = app