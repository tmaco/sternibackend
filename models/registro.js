const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegistroSchema = new Schema(
    {   
        tabla: String,
        tipo: String,
        usuario: String,
        fecha: Date,
        mensaje: String
    }
);

module.exports = mongoose.model('registro', RegistroSchema);