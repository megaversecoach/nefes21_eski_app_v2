"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const trackSchema = new mongoose.Schema({
    track_id : {
        type : String
    },
    track_title : {
        type : String
    },
    track_label : {
        type : String,
    },
    track_duration : {
        type : Number
    },
    track_isFree : {
        type : Boolean
    },
    orderInContent : {
        type : Number
    },
    content_id : {
        type : String
    },
    narrator_id : {
        type : String
    },
    soundscape_id : {
        type : String
    },
    soundscape_volume : {   
        type : Number
    },
    track_isValid : {
        type : Boolean
    },
    track_version : {
        type : Number
    },
    source_id : {
        type : String 
    },
    language : {
        type : String
    }
});

const Track = Nefes21.model('tracks', trackSchema);

module.exports = Track;