"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const contentSchema = new mongoose.Schema({
    content_id : {
        type : String,
        required : true
    },
    content_title : {
        type : String
    },
    content_description : {
        type : String
    },
    content_type_id : {
        type : String
    },
    isMultiTrack : {
        type : Boolean
    },
    content_duration : {
        type : Number
    },
    author_id : {
        type : String
    },
    coverImageUrl : {
        type : String
    },
    showcaseImageUrl : {
        type : String
    },
    content_isFree : {
        type : Boolean,
        default : false
    },
    content_isNew : {
        type : Boolean
    },
    ageSegment : {
        type : String
    },
    genderSegment : {
        type : String
    },
    dateCreated : {
        type : Number
    },
    datePublished : {
        type : Number
    },
    content_isValid : {
        type : Boolean
    },
    content_version : {
        type : Number
    },
    language : {
        type : String
    }
});

const Content = Nefes21.model('contents', contentSchema);

module.exports = Content;