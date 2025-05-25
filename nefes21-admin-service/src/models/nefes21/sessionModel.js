
const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const sessionSchema = new mongoose.Schema({
    session_id : {
        type : String
    },
    session_token : {
        type : String
    },
    os_version : {
        type : String
    },
    app_version : {
        type : String
    },
    ip_address : {
        type : String
    },
    timezone : {
        type : String
    },
    location : {
        type : String
    },
    dateStarted : {
        type : Number
    },
    dateEnded : {
        type : Number
    },
    session_duration : {
        type : Number
    }
});

const Session = Nefes21.model('sessions', sessionSchema);

module.exports = Session;
