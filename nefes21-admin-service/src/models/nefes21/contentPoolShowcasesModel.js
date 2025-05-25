"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection'); 

const contentPoolShowcasesSchema = new mongoose.Schema({
    content_id : {
        type : String,
        required : true
    },
    dimension_id : {
        type : String,
        required : true
    },
    language : {
        type : String,
        required : true
    }
});

const ContentPoolShowcases = Nefes21.model('contentpool_showcases', contentPoolShowcasesSchema);

module.exports = ContentPoolShowcases; 