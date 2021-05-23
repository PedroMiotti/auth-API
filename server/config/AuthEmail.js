// Enviar o e-mail de autenticacao de email

// IMPORTS
const nodemailer = require('nodemailer') // Send email 
const hbs = require('nodemailer-express-handlebars') // Email templates with HandleBars

const jwt = require('jsonwebtoken') // Token 
const jwtSecret = require('../config/jwt') // Secret Key

const path = require('path') // Bring in PATH


// Configurando o Transporter do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWD
    },
    tls: {
         rejectUnauthorized: false 
    },
})

transporter.use('compile', hbs({
    viewEngine: { extName: '.handlebars', partialsDir: '../Server/views' },
    viewPath: '../Server/views',
}))


const sendConfirmationEmail = (emailUsuario) => {

    const emailToken = jwt.sign({emailUsuario}, jwtSecret.emailSecret, {expiresIn: 86400}) // Criando Token

    const urlEmail = `http://localhost:8085/usuario/confirmacao/${emailToken}` // Criando url para o usuario clicar

    const emailImagePath = path.join(__dirname, '../assets/img/email.png')
   
    // info dentro do email
    const ConfirmacaoEmail = {
        from: 'pedromiotti7@gmail.com',
        to: emailUsuario,
        subject: 'Confirmacao de email',
        template: 'confirmationEmail',
        context: {
            urlEmail: urlEmail
        },
        attachments: [{
            filename: 'email.png',
            path:  emailImagePath,
            cid: 'email' 
        }]
        
    }
  
    // Enviando o email
    transporter.sendMail(ConfirmacaoEmail, (error, info) => {
        if(error){
            console.log("Erro ao enviar o e-mail : " + error)
        }
        else{
            console.log('Email enviado com sucesso' + info.response)
       
        }

    })


}

module.exports = sendConfirmationEmail

