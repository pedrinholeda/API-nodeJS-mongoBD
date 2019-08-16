const mongoose = require('../database');
const bcrypt = require('bcryptjs')  // biblioteca de hash para encriptografar a senha
;
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,                  //obrigatorio
    },
    email: {
        type: String,
        unique: true,                   // define como unica
        required: true,
        lowercase: true,                // convertido em caixa baixa
    },
    password: {
        type: String,
        required: true,
        select: false,                  // usado para quando for feita a busca no banco de dados a informação da senha não vir junto no array
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre('save', async function(next){    // .pre e uma função do mongoose para que algo aconteça antes de salvar no banco
    const hash = await bcrypt.hash( this.password, 10); //quando um novo usario for criado será gerado um hash da senha, 10x (numero de rounds / para um hash mais forte )
    this.password = hash;

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;