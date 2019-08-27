const fs = require('fs');
const path = require('path');

module.exports = app => {
  fs
      .readdirSync(__dirname)   //função para ler um diretorio
      .filter(file => ((file.indexOf ('.')) !== 0 && (file !== "index.js")))  //filtrando arquivos que nao começam com ponto, e não sejam index.js
      .forEach(file => require(path.resolve(__dirname, file))(app)); // percorrendo os arquivos e dando um require neles, passando app para cada um deles

};