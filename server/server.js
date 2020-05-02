// IMPORTS
const express = require('express') // Server
const app = express() // Variable for server

const mongoose = require('mongoose') // DataBase
const db = require('./config/db') // Getting the Mongo URI

const dotenv = require('dotenv') // Enviroment Variables

const bodyParser = require('body-parser') 

const passport = require('passport') // Autenticao de Login
require('./config/auth') // Importando arquivo de configuracao do passport

// IMPORTING ROUTES
const usuarios = require('./routes/usuario')

 
// CONFIG
    // Enabling Enviroment Variables
        dotenv.config()

    // Passport
        app.use(passport.initialize()) // Inicializando 

    // Body-Parser
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: true }))

    // Mongoose 
        mongoose.Promise = global.Promise
        // Conectando ao Database
            mongoose.connect(db.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true } ).then(() => {

                console.log('Database OK !')

            }).catch((err) => {

                console.log('Erro ao se conectar ao Database : ' + err)

            })



// ROUTES 

    // Home
        app.get('/', (req, res) => {

            console.log('homeRoute')
            
            
        })


    // Usuario
        app.use('/usuario', usuarios)


//Setting up Port
const PORT = process.env.PORT || 8085
app.listen(PORT, () => {

    console.log('Servidor OK !')

})




























