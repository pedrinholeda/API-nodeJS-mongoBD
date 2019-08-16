const express = require ('express');        //exportando express
const bodyParse = require('body-parser');    //exportando bodyParse

const app = express(); //chamando a função express

app.use(bodyParse.json());  // funçao para que ele entenda quando for enviada requisições para a API em Json
app.use(bodyParse.urlencoded({ extended: false }));  // para entender quando for passado parametros via url , para conseguir decodar esses parametros

                                                                //app.get('/', (req, res) =>{   // req == dados da requisição
                                                                // res.send('OK');          // res == envia resposta para o usuario quando ele acessar a rota
                                                                //});
require('./controllers/authController')(app); // repassando o app para o AuthController
require('./controllers/projectController')(app);

app.listen(3030);