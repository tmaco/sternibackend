const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statusPlayerSchema = new Schema(
    {
        player_id: { type: Number, required: true } ,
        last_name : { type: String, required: true } ,
        first_name : { type: String, required: true } ,
        player_name : { type: String, required: true } ,
        currentInjury: { type: String, required: true } ,
        currentStatus: { type: String, required: true } 
    }
);

module.exports = mongoose.model('statusplayer', statusPlayerSchema);