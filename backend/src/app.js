const express = require('express')
const routes = require('./routes')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(cors({ origin: `https://supermoonn.herokuapp.com`}))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes)

module.exports = app