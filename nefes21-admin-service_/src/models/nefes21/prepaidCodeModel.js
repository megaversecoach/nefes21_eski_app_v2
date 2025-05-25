"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const codeSchema = new mongoose.Schema({
    code_id : {
        type : String
    },
    product_id : {
        type : String
    },
    supplier_id : {
        type : String
    }, 
    expiration_date : {
        type : String
    },
    dateCreated : {
        type : String,
        default : Date.now
    },
    code_isRedeemed : {
        type : Boolean,
        default : false
    },
    code_isValid : {
        type : Boolean,
        default : true
    }
});

const PrepaidCode = Nefes21.model('prepaid_codes', codeSchema);

module.exports = PrepaidCode;