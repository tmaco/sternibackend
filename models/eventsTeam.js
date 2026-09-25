const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 1. Importamos la conexión correspondiente desde el archivo que creamos antes
//const { dbPrincipal } = require("../database"
//const { dbSecundaria } = require('../database'); 

const EventsTeamSchema = new Schema(
    {
        season_id: { type: String, required: true } ,
        event_id: { type: Number, required: true } ,
        event_status: { type: String, required: true } ,
        event_start_date_time: { type: Date, required: true },
        event_season_type: { type: String, required: true } ,
        team_event_number_in_season: { type: Number, required: true },
        team_event_location_type: { type: String, required: true } ,
        team_event_result: { type: String, required: true } ,
        team_points_scored: { type: Number, required: true },
        team_events_won: { type: Number, required: true },
        team_events_lost: { type: Number, required: true },
        team_id: { type: String, required: true } , 
        opponent_id: { type: String, required: true } , 
        opponent_points_scored: { type: Number, required: true },
        opponent_events_won: { type: Number, required: true },
        opponent_events_lost: { type: Number, required: true },
        event_neutral_site: { type: Boolean}
    }
);

module.exports = mongoose.model('eventsteam', EventsTeamSchema);
// 2. CAMBIO AQUÍ: En lugar de usar 'mongoose.model', usamos 'dbSecundaria.model'
//module.exports = dbPrincipal.model("eventsteam", UserSchema);
//module.exports = dbSecundaria.model('eventsteam', EventsTeamSchema);
