"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const soundscapeSchema = new mongoose.Schema({
    soundscape_id : {
        type : String
    },
    soundscape_title : {
        type : String
    },
    coverImageUrl : {
        type : String
    },
    soundscape_isFree : {
        type : Boolean
    },
    soundscape_isValid : {
        type : Boolean
    },
    soundscape_version : {
        type : Number
    },
    language : {
        type : String
    }
});

const Soundscape = Nefes21.model('soundscapes', soundscapeSchema);

module.exports = Soundscape;