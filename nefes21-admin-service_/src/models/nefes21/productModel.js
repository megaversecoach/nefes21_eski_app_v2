"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const productSchema = new mongoose.Schema({
    product_id : {
        type : String
    },
    product_type : {
        type : String
    },
    product_label : {
        type : String
    },
    subscription_plan : {
        type : String
    },
    subscription_duration : {
        type : String
    },
    product_title : {
        type : String
    },
    program_id : {
        type : String
    }
});

const Product = Nefes21.model('products', productSchema);

module.exports = Product;