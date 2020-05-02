//Checando se estamos em ambiente de desenvolvimento ou producao para setar o db.uri

if(process.env.NODE_ENV == 'production'){

    module.exports = {DATABASE_URL: 'Set_Later'}

}

else {

    module.exports = {DATABASE_URL: 'mongodb://localhost/login'}

}
