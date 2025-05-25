"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection'); 

const contentPoolSeriesSchema = new mongoose.Schema({
    content_id : {
        type : String,
        required : true
    },
    dimension_id : {
        type : String,
        required : true
    },
    section_id : {
        type : String,
        required : true
    },
    language : {
        type : String,
        required : true
    }
});

const ContentPoolSeries = Nefes21.model('contentpool_series', contentPoolSeriesSchema);

module.exports = ContentPoolSeries; 