"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const contentTypeSchema = new mongoose.Schema({
    content_type_id : {
        type : String
    },
    content_type_label : {
        type : String
    },
    content_type_color : {
        type : String
    },
    language : {
        type : String
    }
});

const ContentType = Nefes21.model('content_types', contentTypeSchema);

module.exports = ContentType;