const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { dbPrincipal } = require("../database");


const MenuSchema = new Schema(
    {   
        title: String,
        url: String,
        order: Number,
        active: Boolean
    }
);

module.exports = dbPrincipal.model('menu', MenuSchema);
