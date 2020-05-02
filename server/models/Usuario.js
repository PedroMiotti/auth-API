// IMPORTS 
const mongoose = require('mongoose')
const Schema = mongoose.Schema


// Setting Up Model Usuario


    const Usuario = new Schema ({
        
        nome: {
            type: String,
            required: true
        },

        sobrenome: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        confirmado: {
            type: Boolean,
            default: false
        },

        senha: {
            type: String,
            required: true
        }

    })


// Exporting
mongoose.model('usuarios', Usuario)


