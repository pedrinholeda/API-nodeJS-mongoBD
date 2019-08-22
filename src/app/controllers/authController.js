const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); //biblioteca para poder usar tokens
const crypto = require ('crypto'); 
const mailer = require('../../modules/mailer');



const authConfig = require('../../config/auth');

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

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email }); // verificando se o email esta cadastrado

        if (!user)
          return res.status(400).send({ error: 'User not found'});

        const token = crypto.randomBytes(20).toString('hex'); //gerando um token randomico de 20 caracteres e hexadecimal.

        const now = new Date();
        now.setHours(now.getHours() + 1); // exprira ção do token, pega a hora atual e soma mais um.

        await User.findByIdAndUpdate(user.id, {
            '$set':{
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        }); 

        mailer.sendMail({
            to: email,
            from: 'pedro.guimaraes@firstdecision.com.br',
            template: 'auth/forgot_password',
            context: { token },

        }, (err)=> {
            if(err)
            
                res.status(401).send({ error: 'Cannot send forgot password email' });
            return res.send('ok');
        });

    } catch(err){
        console.log(err);
        res.status(400).send({ error: 'Erro on forgot password, try again' });

    }
}); //rota de esqueci minha senha

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;

    try {
        const user = await User.findOne({ email })
        .select('+passwordResetToken passwordResetExpires');

        if (!user)
            return res.status(400).send({ error: 'User not found' });

        if(token !== user.passwordResetToken)
             return res.status(400).send({ error: 'Token invalid' });

        const now = new Date();

        if(now> user.passwordResetExpires)
            return res.status(400).send({ error: 'Token expired, generate a new one' });

        user.password = password;

        await user.save();
        
        res.send();
    } catch (err){
        res.status(400).send({ error: 'Connot reset password, try again' });
    }
});



module.exports = app => app.use('/auth', router); // recebendo app passado pelo index