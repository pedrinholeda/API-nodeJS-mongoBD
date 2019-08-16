const mongoose = require ('mongoose');

mongoose.connect('mongodb://localhost/noderest'); // conectando ao banco de dados
mongoose.Promise = global.Promise;                // indicar qual a classe de promisse /// padrao para todo projeto

module.exports = mongoose;