const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { dbPrincipal } = require("../database");

const fantasyLineupSchema = new Schema(
    {
        name_team: { type: String, required: true } ,
        user_id: { type: String, required: true } ,
        league_id: { type: String, required: true } ,
        season_id: { type: String, required: true } ,
        number_match: { type: Number, required: true },
        fantasy_scoring :  { type: Number, default: 0 },
        fantasy_scoring_prev :  { type: Number, default: 0 },
        position_prev :  { type: Number, default: 0 },
        puntos_fantasy :  { type: Number, default: 0 },
        total_minutes :  { type: Number, default: 0 },
        fantasy_scoringG :  { type: Number, default: 0 },
        fantasy_scoringF :  { type: Number, default: 0 },
        fantasy_scoringC :  { type: Number, default: 0 },
        fantasyLineup: [ { 
            player_id: { type: Number, required: true },
            player_name : { type: String, required: true },
            position: { type: String, required: true },
            numMatches :  { type: Number, default: 0 },
            fScoring :  { type: Number, default: 0 },
            fScoring_prev: { type: Number, default: 0 },
            minutes :  { type: Number, default: 0 },
            avatar: { type: String, required: true },
            order :  { type: Number, required: true }
        } ],
        injuryList: [ {
            player_id: { type: Number, required: true },
            player_name : { type: String, required: true },
            avatar: { type: String, required: true },
            position: { type: String, required: true },
            date: { type: Date, required: true }
        } ]
    }
);

module.exports = dbPrincipal.model('fantasylineup', fantasyLineupSchema);
