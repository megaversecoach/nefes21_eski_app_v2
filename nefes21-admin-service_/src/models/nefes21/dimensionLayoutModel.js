"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const dimensionLayoutSchema = new mongoose.Schema({
    content_id : {
        type : String
    },
    soundscape_id : {
        type : String
    },
    showcase_type_id : {
        type : String
    },
    orderInCategory : {
        type : Number,
        required : true
    },
    category_id : {
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

const DimensionLayout = Nefes21.model('dimension_layout', dimensionLayoutSchema);

module.exports = DimensionLayout;