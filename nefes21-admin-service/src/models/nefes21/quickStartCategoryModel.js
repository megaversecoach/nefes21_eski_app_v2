"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const quickStartCategorySchema = new mongoose.Schema({
    qs_category_id : {
        type : String,
        required : true
    },
    qs_category_label : {
        type : String,
        required : true
    },
    qs_category_description : {
        type : String,
        required : true
    },
    qs_category_icon : {
        type : String
    },
    orderInSection : {
        type : Number,
        required : true
    },
    language : {
        type : String,
        required : true
    }
});

const QuickStartCategory = Nefes21.model('quickstart_categories', quickStartCategorySchema);

module.exports = QuickStartCategory;