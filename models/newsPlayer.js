const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { dbPrincipal } = require("../database");


const newsPlayerSchema = new Schema(
    {
        key:{ type: String, required: true } ,
        player_id: { type: Number, required: true } ,
        last_name : { type: String, required: true } ,
        first_name : { type: String, required: true } ,
        player_name : { type: String, required: true } ,
        currentTitle: { type: String, required: true } ,
        currentDescription: { type: String, required: true } ,
        lastUpdatedOn: { type: Date, required: true },

    }
);

module.exports = dbPrincipal.model('newsplayer', newsPlayerSchema);
