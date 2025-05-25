"use strict"

const mongoose = require('mongoose');
const{Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const showcaseTypeSchema = new mongoose.Schema({
    showcase_type_id : {
        type : String,
        required : true
    },
    showcase_label : {
        type : String,
        required : true
    },
    language : {
        type : String,
        required : true
    }
});

const ShowcaseType = Nefes21.model('showcase_types', showcaseTypeSchema);

module.exports = ShowcaseType;