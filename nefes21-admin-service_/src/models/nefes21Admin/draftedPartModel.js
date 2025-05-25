"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const draftedPartSchema = new mongoose.Schema({
    part_id : {
        type : String,
        required : true, 
        unique : true
    },
    part_title : {
        type : String,
        required : true
    },
    part_label : {
        type : String,
        required : true
    },
    part_duration : {
        type : Number,
        required : true
    },
    part_type : {
        type : String,
        required : true
    },
    quest_title : {
        type : String,
        required : true
    },
    quest_description : {
        type : String,
        required : true
    },
    quest_information : {
        type : String,
        required : true
    },
    orderInSection : {
        type : Number,
        required : true
    },
    section_id : {
        type : String,
        required : true
    },
    program_id : {
        type : String,
        required : true
    },
    soundscape_id : {
        type : String,
        required : true
    },
    soundscape_volume : {
        type : Number,
    },
    part_isValid : {
        type : Boolean,
        required : true
    },
    part_version : {
        type : Number,
        required : true
    },
    language : {
        type : String,
        required : true
    }
});

const DraftedPart = Nefes21Admin.model('drafted_parts', draftedPartSchema);

module.exports = DraftedPart;
