const express = require('express')
const routes = require('./routes')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

const whitelist = [`https://supermoonn.herokuapp.com`]

app.use(cors({ origin: `https://supermoonn.herokuapp.com`}))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes)

module.exports = app