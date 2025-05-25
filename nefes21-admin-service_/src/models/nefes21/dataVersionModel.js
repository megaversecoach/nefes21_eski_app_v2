"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const dataVersionSchema = new mongoose.Schema({
    collection_id : {
        type : String,
        required : true
    },
    latest_version : {
        type : Number,
        required : true
    },
    language : {
        type : String,
        required : true
    }
});

const DataVersion = Nefes21.model('data_versions', dataVersionSchema);

module.exports = DataVersion;

