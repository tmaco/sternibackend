const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { dbPrincipal } = require("../database");


const TeamSchema = new Schema(
    {
      team_id: { type: String, required: true },
      abbreviation: { type: String, required: true },
      active: { type: String, required: true },
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      conference: { type: String, required: true },
      division: { type: String, required: true },
      site_name: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      full_name: { type: String, required: true },
    }
);

module.exports = dbPrincipal.model('teams', TeamSchema);
