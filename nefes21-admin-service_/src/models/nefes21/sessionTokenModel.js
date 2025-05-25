
const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const sessionTokenSchema = new mongoose.Schema({
    session_token_id : {
        type : String
    },
    session_token : {
        type : String,
    },
    uuid  : {
        type : String
    },
    login_method : {
        type : String
    },
    device_id : {
        type : String
    },
    device_model : {
        type : String
    },
    platform : {
        type : String
    },
    session_status : {
        type : String,
    },
    dateCreated : {
        type : Number,
    },
    dateInvalidated : {
        type : Number,
    }
});

const SessionToken = Nefes21.model('session_tokens', sessionTokenSchema);

module.exports = SessionToken;