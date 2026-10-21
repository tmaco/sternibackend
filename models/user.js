const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { dbPrincipal } = require("../database");

const UserSchema = new Schema(
    {
        first_name: String,
        last_name: String,
        email: {
            type: String,
            unique: true
        },
        password: String,
        role: { 
            type: String, 
            enum: ['admin', 'commish', 'user'] 
        },
        active: Boolean,
        avatar: String,
        isPPMazos: Boolean,


    }
);

module.exports = dbPrincipal.model('user', UserSchema);
