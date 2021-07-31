// Arquivo para fazer a autenticao do usuario com o passport

// IMPORTS
const mongoose = require('mongoose') // DB

const bcrypt = require('bcryptjs') // Hash passwords

const passport = require('passport') // Autenticao de Login

const localStrategy = require('passport-local').Strategy // Strategy Local Auth
const JWTstrategy = require('passport-jwt').Strategy // Strategy JWT Auth
const ExtractJwt = require('passport-jwt').ExtractJwt // extracao do token JWT

const jwtSecret = require('./jwt') // Secret Key



// MODELS
    // Usuario
        require('../models/Usuario')
        const Usuario = mongoose.model('usuarios')




// LOCAL STRATEGY -- LOGIN
    // Configurando o passport para fazer a autenticacao pelo email
    passport.use('login', new localStrategy( { usernameField: 'email', passwordField: 'senha', session: false }, (email, senha, done) =>{

        // Pegando o email do banco de dados
        Usuario.findOne({email: email}).then((usuario) => {

        // Primeiro verificar se existe o email no banco de dados
            // Se nao achar o email no banco de dados
            if(!usuario){

                console.log('Esta conta nao existe !')

                return done(null, false, {message: 'Esta conta nao existe !' })
                
            }

            // Se achar o email no banco de dados
                // Comparando a senha inserida com a senha hasheda
                bcrypt.compare(senha, usuario.senha, (error, batem) => {
                
                    // Se as senha baterem
                    if(batem){

                        console.log('Login realizado com sucesso !')
                        
                        return done(null, usuario) // Retorna info do usuario e a mensagem
                        

                    }
                    // Se nao
                    else {
                        
                        console.log('Senha incorreta !')

                        return done(null, false, {message: 'Senha incorreta !'}) // Retorna apenas a mensagem

                    }
                })




        }).catch((err) => {

            console.log('Erro interno : ' + err)

            done(err)
            
        })

    }))



// JWT STRATEGY -- To check the tokens        
    const config = {

        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'), // To extract the token send back from the client with the header of 'JWT'

        secretOrKey: jwtSecret.secret, // Getting the secret key from the config file

    }
    


    passport.use('jwt', new JWTstrategy(config, (jwt_payload, done) => {
        // Achando o usuario pelo email que e enviado pelo client by the token
        
        
        Usuario.findOne({email: jwt_payload.email}).then(usuario => {
            // Se achar o usuario
            if(usuario){

                console.log('Usuario localizado no banco de dados !')

                done(null, usuario) // Apresenta as informacoes do usuario mas nao retorna o usuario

            }
            // Se nao
            else {
                
                console.log('Usuario nao localizado no banco de dados')

                done(null, false)

            }
        }).catch((err) => {

            done(err)

        })
    }))






























































