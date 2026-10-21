const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { dbPrincipal } = require("../database");


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

//module.exports = mongoose.model('registro', RegistroSchema);
module.exports = dbPrincipal.model('registro', RegistroSchema);
