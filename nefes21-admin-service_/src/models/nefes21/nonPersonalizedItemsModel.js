"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const nonPersonalizedItemsShema = new mongoose.Schema({
    showcase_id: {
        type: String,
        required: true
    },
    showcase_imageUrl: {
        type: String,
        required: true
    },
    action: {
        type: String
    },
    actionUrl: {
        type: String
    },
    content_id: {
        type: String
    },
    priorityRating: {
        type: Number,
        required: true
    },
    showcase_type_id: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    showcase_isValid : {
        type: Boolean,
        required : true
    },
    showcase_isFree : {
        type : Boolean, 
        required : false
    },
    language: {
        type: String,
        required: true
    }
});

const NonPersonalizedItem = Nefes21.model('showcase_nonpersonalized_items', nonPersonalizedItemsShema);

module.exports = NonPersonalizedItem;