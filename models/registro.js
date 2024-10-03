const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegistroSchema = new Schema(
    {   
        tabla: String,
        tipo: String,
        usuario: String,
        fecha: Date,
        league: String,
        mensaje: String,
        player_id: Number

    }
);

module.exports = mongoose.model('registro', RegistroSchema);