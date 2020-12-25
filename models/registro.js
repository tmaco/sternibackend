const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegistroSchema = new Schema(
    {   
        tabla: String,
        tipo: String,
        usuario: String,
        mensaje: String
    }
);

module.exports = mongoose.model('registro', RegistroSchema);