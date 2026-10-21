const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { dbPrincipal } = require("../database");

const fantasyLeagueSchema = new Schema(
    {
      season_id: { type: String, required: true } ,
      league_id: { type: String, required: true} ,
      name_league: { type: String, required: true } ,
      theme: { type: String, required: true } ,
      password_league: { type: String, required: true } ,
      maximum_teams: { type: String, required: true } ,
      scoring: { type: Number, default: 0},
      offensive_rebounds: { type: Number, default: 1},
      defensive_rebounds: { type: Number, default: 1},
      assisting: { type: Number, default: 1},
      stealing: { type: Number, default: 1},
      blocking: { type: Number, default: 1},
      turnovers: { type: Number, default: -1},
      personal_fouls: { type: Number, default: 0},
      field_goals_attempted: { type: Number, default: -0.5},
      field_goals_made: { type: Number, default: 2},
      field_goals_missed: { type: Number, default: 0},
      two_point_attempted: { type: Number, default: 0},
      two_point_made: { type: Number, default: 0},
      two_point_missed: { type: Number, default: 0},
      three_point_attempted: { type: Number, default: 0},
      three_point_made: { type: Number, default: 1},
      three_point_missed: { type: Number, default: 0},
      free_throws_attempted: { type: Number, default: -0.5},
      free_throws_made: { type: Number, default: 1},
      free_throws_missed: { type: Number, default: 0},
      is_winner: { type: Number, default: 0},
      is_loser: { type: Number, default: 0},
      is_home: { type: Number, default: 0},
      is_away: { type: Number, default: 0},
      is_starter: { type: Number, default: 0},
      is_double_double: { type: Number, default: 0},
      is_triple_double: { type: Number, default: 0},
      is_PointsPerMinute: { type: Boolean, required: true } ,
      position_format: {
      	type: String,
      	enum: ['Default', 'Modern', '5-Players', '8-Players', '10-Players', '12-Players', '15-Players', 'Vomistar_League'],
      	default: 'Default'
      }
    }
);

module.exports = dbPrincipal.model("fantasyleague", fantasyLeagueSchema);
