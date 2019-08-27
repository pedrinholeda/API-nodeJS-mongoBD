const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars'); // para trabalhar com tamplates de emails

const { host, port, user, pass } = require('../config/mail.json'); //importando informaçoes do arquivo de configuração

const transport = nodemailer.createTransport({ // desestruturação
  host,
  port,
  auth: { user,pass },
});

transport.use('compile', hbs({ // configurando transporte
  viewEngine: {
    viewEngine: 'handlebars',
    partialsDir: 'some/path',
    defaultLayout: false },
  viewPath: path.resolve("./src/resources/mail/"), //onde ficam as Views de templates de emails. (tem que partir da raiz absoluta)
  extName: '.html',
}));

module.exports = transport;