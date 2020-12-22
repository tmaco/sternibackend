const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema(
    {
      player_id: { type: Number, required: true },
      season_id: { type: String, required: true },
      team_id: { type: String, required: true },
      last_name: { type: String, required: true },
      first_name: { type: String, required: true },
      display_name: { type: String, required: true },
      birthdate: { type: Date, required: true },
      age: { type: Number, required: true },
      birthplace: { type: String, required: true },
      height_in: { type: Number, required: true },
      height_cm: { type: Number, required: true },
      height_m: { type: Number, required: true },
      height_formatted: { type: String, required: true },
      weight_lb: { type: Number, required: true },
      weight_kg: { type: Number, required: true },
      position: { type: String, required: true },
      uniform_number: { type: Number, required: true },
      roster_status: { type: String, required: true },
      avatar: { type: String }
    }
);

module.exports = mongoose.model('players', PlayerSchema);