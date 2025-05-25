"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const program_gainsSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    orderInSection: {
        type : Number,
        required : true
    }
}, {_id : false});

const programSectionsSchema = new mongoose.Schema({
    section_id : {
        type : String,
        required : true
    },
    section_title : {
        type : String,
        required : true
    },
    order : {
        type : Number,
        required : true
    }
}, {_id : false});

const programSchema = new mongoose.Schema({
    program_id : {
        type : String,
        required : true
    },
    program_title : {
        type : String,
        required : true
    },
    program_description : {
        type : String,
        required : true
    },
    program_information : {
        type : String
    },
    program_gains : [program_gainsSchema],
    program_duration : {
        type : Number,
        required : true
    },
    author_id : {
        type : String,
        required : true
    },
    coverImageUrl : {
        type : String,
        required : true
    },
    bgImageUrl : {
        type : String
    },
    program_partCount : {
        type : Number,
        required : true
    },
    program_sections : [programSectionsSchema],
    trailerUrl : {
        type : String,
        required : true
    },
    trailerCoverImageUrl : {
        type : String,
        required : true
    },
    program_isNew : {
        type : Boolean,
        required : true
    },
    program_isFree : {
        type : Boolean,
        required : true
    },
    program_isOnSale : {
        type : Boolean,
        required : true
    } ,
    product_id : {
        type : String,
        required : true
    },
    discounted_product_id : {
        type : String,
        required : true
    },
    discountRate : {
        type : Number,
        required : true
    },
    dateCreated : {
        type : Number,
        default : Date.now
    },
    datePublished : {
        type : Number
    },
    program_isValid : {
        type : Boolean,
        required : true
    },
    program_version : {
        type : Number,
        required : true
    },
    language : {
        type : String,
        required : true
    }
});

const Program = Nefes21.model('programs', programSchema);

module.exports = Program;




