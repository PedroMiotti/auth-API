//Arquivo para a rota de Usuarios

// IMPORTS
const express = require('express') // Server
const router = express.Router() // Routing variable

const mongoose = require('mongoose') // DataBase

const bcrypt = require('bcryptjs') // Hash password

const passport = require('passport') // Autenticao de Login

const jwt = require('jsonwebtoken') // Token 


const jwtSecret = require('../config/jwt') // Secret Key

const sendConfirmationEmail = require('../config/AuthEmail') // Enviar email de confirmacao



 
// MODELS
    // Usuario
        require('../models/Usuario')
        const Usuario = mongoose.model('usuarios')



// ROUTES

    // Home
    router.get('/', (req, res) => {
        res.send('Pagina de usuarios')
    })

    // Registro Usuarios

        router.get('/registro', (req, res) => {
            res.send('Tela de registro')
        })


        router.post('/registro',(req, res) => {

            // Verificando se ja existe um e-mail no DB
                Usuario.findOne( { email: req.body.email } ).then((usuario) => {

                    if(usuario){
 
                        console.log("Esse e-mail ja esta em uso ")
                        res.status(401).send({message: "Esse e-mail ja esta em uso "})

                    }
                    else{

                        // Criando variavel com as informacao do usuario
                        const novoUsuario = new Usuario ({
                            nome: req.body.nome,
                            sobrenome: req.body.sobrenome,
                            email: req.body.email,
                            senha: req.body.senha
                        })

                        // Hashing the password
                        bcrypt.genSalt(10, (error, salt) => {
                            bcrypt.hash(novoUsuario.senha, salt, (error, hash) => {

                                if(error){
                                    console.log("Erro ao hashear a senha : " + error)
                                    res.status(303).send({message: 'Erro interno no servidor'})
                                }

                                // Definindo a nova senha do usuario
                                novoUsuario.senha = hash

                                // Salvando o usuario no DB
                                novoUsuario.save().then(() => {

                                    console.log('Usuario salvo com sucesso !')
                                    res.status(200).send({message: "Usuario criado com sucesso !"})
                                    sendConfirmationEmail(novoUsuario.email, novoUsuario.email)

                                }).catch((err) => {

                                    console.log('Erro ao salvar o usuario : ' + err)
                                    res.status(303).send({message: 'Erro interno no servidor'})

                                })


                            })
                        })

                    }

                }).catch((err) => {

                    console.log('Erro interno :' + err)
                    res.status(500).send({message: 'Erro interno no servidor'})

                })
        })

        // Rota de confirmacao email com o token e atualizando o campo 'confirmado' para true quando o link do email e clicado
        router.get('/confirmacao/:token', async (req, res) => {
            try{
                
                const decoded = jwt.verify(req.params.token, jwtSecret.emailSecret) // Verificando o token e desestruturando o email do token
                await Usuario.updateOne({email: decoded.emailUsuario}, {$set: { confirmado: true }}, {useFindAndModify: false,  upsert: false}) // Atualizando o campo 'confirmado' no BD
                
            }
            catch (err){

                res.status(500).send({message: 'Erro no servidor ao autenticar email !'})
                console.log(err)

            }
        })


    // Login
        
        router.get('/login', (req, res) => {

            
            res.send('Login Page')
            

        })


        // Rota de autenticacao de usuario
        router.post('/login', (req, res, next) => {
            

            passport.authenticate('login', (err, usuarios, info) => {
                
                if(err){

                    console.log(`Error ${err}`)
                }
                
                // Passing the messages
                if(info !== undefined){

                    
                    if(info.message === 'Esta conta nao existe !'){

                        res.status(401).send({message: info.message})
                        

                    }
                    else{

                        res.status(403).send({message: info.message})

                    }
                }
                
                // When the user logged in successufully send the token with to expire in 60 * 60,  with token key and with the token info wich is the user email
                else{
                    
                    req.logIn(usuarios, () => {

                        Usuario.findOne({email: req.body.email}).then(usuario => {

                            const token = jwt.sign({ email: usuario.email }, jwtSecret.secret, {expiresIn: 18000,}) // Setting the infomation that goes into the token
                            
                            res.status(200).send({ auth: true, token, message: 'Usuario logged in com sucesso !'}) // Sending the info when the user logged in succefully
                            

                        })
                    })
                }
            } )(req, res, next)
        })


    // Logout
        
        router.get('/logout', (req, res) => {

            req.logout()
            console.log('Deslogado com sucesso')

            res.redirect('/')

        })

    // Info do usuario 
        router.get('/info', (req, res, next) => {
            passport.authenticate('jwt', {session: false}, (err, usuario, info) => {
                
                if(info !== undefined){
                    console.log('Erro ' + info.message)
                    res.status(401).send({message: info.message})
                }

                else if(usuario.email === req.query.email){
                    Usuario.findOne({email: req.query.email}).then((usuario) => {

                        //Se encontrar o usuario
                        if(usuario != null){
                            
                            res.status(200).send({auth: true, nome: usuario.nome, sobrenome: usuario.sobrenome, email: usuario.email})
                        }
                        // Se nao encontrar o usuario
                        else{
                            
                            res.status(401).send({message: 'Usuario nao encontrado !'})
                        }
                    })
                }

                else {
                    console.log('JWT token no match')
                    res.status(403).send({message: 'JWT token does not match'})
                }

            })(req, res, next)
        })
    
    
    // Editar usuario
        // router.put('/update', (req, res) => {
        //     passport.authenticate('jwt', {session: false}, (err, usuarios, info) => {
        //         if(error) {
        //             console.log(error)
        //         }

        //         if(info !== undefined) {
        //             console.log(info.message)
        //             res.status(403).send(info.message)
        //         }

        //         else{
        //             Usuario.findOne({email: req.query.email}).then((usuario) => {

        //                 if(usuario != null){
        //                     // Atualizandon variavel com as informacao do usuario
        //                     usuario.update({
        //                         nome: req.body.nome,
        //                         sobrenome: req.body.sobrenome,
        //                         email: req.body.email,
        //                         senha: req.body.senha
        //                     })

        //                 }
        //             })
        //         }
        //     })

        // })





// Exporting
module.exports = router




































