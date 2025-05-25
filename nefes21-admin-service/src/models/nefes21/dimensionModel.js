"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const dimensionSchema = new mongoose.Schema({
    dimension_id : {
        type : String
    },
    dimension_label_top : {
        type : String
    },
    dimension_label_bottom : {
        type : String
    },
    dimension_label : {
        type : String
    },
    dimension_description : {
        type : String
    },
    dimension_bgImage : {
        type : String
    }
});

const Dimension = Nefes21.model('dimensions', dimensionSchema);

module.exports = Dimension;