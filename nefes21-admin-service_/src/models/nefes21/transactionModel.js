"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const transactionSchema = new mongoose.Schema({
    transaction_id : {
        type : String
    },
    uuid : {
        type : String
    },
    payment_method : {
        type : String
    },
    code_id : {
        type : String
    },
    bundle_id : {
        type : String
    },
    app_version : {
        type : String
    },
    product_id : {
        type : String
    },
    purchase_date : {
        type : Number
    },
    expiration_date : {
        type : Number
    },
    isTrialPeriod : {
        type : Boolean
    },
    isIntroductoryPeriod : {
        type : Boolean
    },
    isRefunded : {
        type : Boolean
    },
    program_id : {
        type : String
    },
    environment : {
        type : String
    },
    original_transaction_id : {
        type : String
    },
    original_uuid : {
        type : String
    },
    original_purchase_date : {
        type : Number
    }
});


const Transaction = Nefes21.model('transactions', transactionSchema);

module.exports = Transaction;