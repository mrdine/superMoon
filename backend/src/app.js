const express = require('express')
const routes = require('./routes')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()


// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, content-type, https://supermoonn.herokuapp.com, access-control-allow-origin, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



app.use(cors({
    'allowedHeaders': ['authorization', 'access-control-allow-origin', 'Access-Control-Allow-Origin' ,'Authorization', 'Content-Type'],
    'exposedHeaders': ['Access-Control-Allow-Origin'],
    'origin': 'https://supermoonn.herokuapp.com',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    'preflightContinue': false
  }))




app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes)

module.exports = app