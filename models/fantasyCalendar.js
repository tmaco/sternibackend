const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventosSchema = mongoose.Schema({
    event_id: { type: Number, require: true }
},{ _id : false });

const FantasyCalendarSchema = new Schema(
    {
        season_id: { type: String, required: true } ,
        league_id: { type: String, required: true } ,
        jornada: { type: Number, required: true } ,
        eventos: [eventosSchema]
    }
);

module.exports = mongoose.model('fantasycalendar', FantasyCalendarSchema);