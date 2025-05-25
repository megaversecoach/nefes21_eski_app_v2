"use strict";

const mongoose = require('mongoose');
const{Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const tableIdentifiersSchema = new mongoose.Schema({
    collection_id: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
});

const Identifier = Nefes21Admin.model("table_identifiers", tableIdentifiersSchema);

module.exports = Identifier;