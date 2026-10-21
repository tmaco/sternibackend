const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { dbPrincipal } = require("../database");


const playersStatSchema = new Schema(
    {
        player_id: { type: Number, required: true },
        season_id: { type: String, required: true },
        team_id: { type: String, required: true },
        last_name: { type: String, required: true } ,
        first_name: { type: String, required: true } ,
        display_name: { type: String, required: true } ,
        team_abbreviation: { type: String, required: true },
        opponent_id: { type: String, required: true },
        position: { type: String, required: true },
        seconds: { type: Number, required: true },
        minutes: { type: Number, required: true },
        points: { type: Number, required: true },
        assists: { type: Number, required: true },
        turnovers: { type: Number, required: true },
        steals: { type: Number, required: true },
        blocks: { type: Number, required: true },
        rebounds: { type: Number, required: true },
        field_goals_attempted: { type: Number, required: true },
        field_goals_made: { type: Number, required: true },
        three_point_field_goals_attempted: { type: Number, required: true },
        three_point_field_goals_made: { type: Number, required: true },
        free_throws_attempted: { type: Number, required: true },
        free_throws_made: { type: Number, required: true },
        defensive_rebounds: { type: Number, required: true },
        offensive_rebounds: { type: Number, required: true },
        personal_fouls: { type: Number, required: true },
        is_starter: { type: Boolean, required: true },
        field_goal_percentage: { type: Number, required: true },
        three_point_percentage: { type: Number, required: true },
        free_throw_percentage: { type: Number, required: true },
        field_goal_percentage_string: { type: String, required: true },
        three_point_field_goal_percentage_string: { type: String, required: true },
        free_throw_percentage_string: { type: String, required: true },
        event_id: { type: String, required: true },
        event_start_date_time: { type: Date, required: true },
        event_season_type: { type: String, required: true },
        team_event_location_type: { type: String, required: true },
        team_event_result: { type: String, required: true },
        team_event_number_in_season: { type: Number, required: true },
    }
);

module.exports = dbPrincipal.model('playersstat', playersStatSchema);
