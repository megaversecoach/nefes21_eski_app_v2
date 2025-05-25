"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const categorySchema = new mongoose.Schema({
    category_id : {
        type : String
    },
    category_label  : {
        type : String
    },
    category_description  : {
        type : String
    },
    dimension_id  : {
        type : String
    },
    orderInDimension  : {
        type : Number
    },
    language  : {
        type : String
    }
});

const Category = Nefes21.model('categories', categorySchema);

module.exports = Category;
