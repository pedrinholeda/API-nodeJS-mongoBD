const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); //biblioteca para poder usar tokens











const authConfig = require('../config/auth');

const User = require('../models/User'); //puxando o model de User

const router = express.Router(); // função para definir rotas 

function genarateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {   // gerando o token passando o id (que difere o usuario e não se repete) // passando um hash unico tambem (auth.Config.secret) 
        expiresIn: 86400, //expira em 1 dia
  });
}

router.post('/register', async (req, res) => {
    const { email } = req.body; //pegando o email dos parametros

    try {
        if(await User.findOne({ email }))  // buscando email, caso ja exista, ira retornar um erro 400
            return res.status(400).send({ error: 'Usuario ja existe'}) ;

        const user = await User.create(req.body);

        user.password = undefined;  //removendo a senha manualmente, para ela não retornara para o usuario

        return res.send({ 
            user,
            token: genarateToken({ id: user.id }),
         });
    } catch (err) {
        return res.status(400).send({ error: 'Falha ao registrar '});
    }
});

router.post('/authenticate', async (req, res) =>{ 
    const { email, password } = req.body;  // informações recebidas quando o usuario loga na aplicação

    const user = await User.findOne({ email }).select('+password'); // buscando usuario pelo email para verificar se ele ja existe // select(+password) e para retornar a senha (que foiimpidida de retornar no arquivo user.js)

    if (!user) //verificando se o usuario existe
        return res.status(400).send({ error: 'User not found'});

//usando await pois o bcrypt não e uma funçao sincrona (não tem uma resposta rapida)
    if (!await bcrypt.compare(password, user.password))  // comparando se a senha que esta no login e a mesma do banco de dados 
        return res.status(400).send({ error :'Invalid password'});

    user.password = undefined; 


    res.send({ 
        user,
         token:genarateToken({ id: user.id }) });  // caso logue normalmente retornar usuario e token

});

module.exports = app => app.use('/auth', router); // recebendo app passado pelo index