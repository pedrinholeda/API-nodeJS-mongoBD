const mongoose = require('../../database');
const bcrypt = require('bcryptjs')  // biblioteca de hash para encriptografar a senha
;
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,                  //obrigatorio
    },
    project:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Project',
      require: true,
    },
    assingnedTo:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' ,
      require: true,
    },
    completed: {
      type: Boolean,
      require: true,
      default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;