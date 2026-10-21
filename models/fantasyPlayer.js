const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { dbPrincipal } = require("../database");


const fantasyPlayerSchema = new Schema(
    {
        player_id: { type: Number, required: true } ,
        player_name : { type: String, required: true } ,
        name_team: { type: String, required: true } ,
        league_id: { type: String, required: true } ,
        season_id: { type: String, required: true },
        available: { type: Boolean, default: true },
        isIL: { type: Boolean, default: false },
        salary: { type: Number, default: 1},
        cost: { type: Number, default: 1}, 
        position: { type: String, required: true },
        avatar: { type: String, required: true }    
    }
);

module.exports = dbPrincipal.model('fantasyplayer', fantasyPlayerSchema);
