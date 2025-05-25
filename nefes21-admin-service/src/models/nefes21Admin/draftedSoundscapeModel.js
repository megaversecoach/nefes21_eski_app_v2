"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const draftedSoundscapeSchema = new mongoose.Schema({
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

const DraftedSoundscape = Nefes21Admin.model('drafted_soundscapes', draftedSoundscapeSchema);

module.exports = DraftedSoundscape;