const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fantasyStatSchema = new Schema(
    {
        league_id: { type: String, required: true } ,
        season_id: { type: String, required: true },
        player_name: { type: String, required: true } ,
        player_id: { type: Number, required: true },
        event_id: { type: String, required: true },
        position: { type: String, required: true } ,
        fantasy_scoring: { type: Number, required: true },
        minutes: { type: Number, required: true },
        points_per_minute: { type: Number, required: true },
        points: { type: Number, required: true },
        offensive_rebounds: { type: Number, required: true },
        defensive_rebounds: { type: Number, required: true },
        rebounds: { type: Number, required: true },
        assists: { type: Number, required: true },
        steals: { type: Number, required: true },
        blocks: { type: Number, required: true },
        turnovers: { type: Number, required: true },
        field_goals_attempted: { type: Number, required: true },
        field_goals_made: { type: Number, required: true },
        field_goals_missed: { type: Number, required: true },
        two_point_field_goals_attempted: { type: Number, required: true },
        two_point_field_goals_made: { type: Number, required: true },
        two_point_field_goals_missed: { type: Number, required: true },
        three_point_field_goals_attempted: { type: Number, required: true },
        three_point_field_goals_made: { type: Number, required: true },
        three_point_field_goals_missed: { type: Number, required: true },
        free_throws_attempted: { type: Number, required: true },
        free_throws_made: { type: Number, required: true },
        free_throws_missed: { type: Number, required: true },
        personal_fouls: { type: Number, required: true },
        is_starter: { type: Boolean, required: true },
        is_double_double: { type: Boolean, required: true },
        is_triple_double: { type: Boolean, required: true },
        date_match: { type: Date, required: true },
        number_match: { type: Number, required: true },
        type_match: { type: String, required: true } ,
        location_match: { type: String, required: true } ,
        result_match: { type: String, required: true }  
    }
);

module.exports = mongoose.model('fantasystat', fantasyStatSchema);