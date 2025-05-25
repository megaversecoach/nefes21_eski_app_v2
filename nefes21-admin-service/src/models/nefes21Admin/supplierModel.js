"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const supplierSchema = new mongoose.Schema({
    supplier_id : {
        type : String
    },
    supplier_label : {
        type : String
    }
});

const Supplier = Nefes21Admin.model('suppliers', supplierSchema);

module.exports = Supplier;