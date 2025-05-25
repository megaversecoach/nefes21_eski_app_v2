"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const narratorSchema = new mongoose.Schema({
    narrator_id: {
        type: String,
        required: true
    },
    narrator_name: {
        type: String,
        required: true
    },
    narrator_surname: {
        type: String,
        required: true
    },
    narrator_title: {
        type: String,
        required: true
    },
    narrator_info: {
        type: String
    },
    profilePicUrl: {
        type: String
    },
    language: {
        type: String
    }
});

const Narrator = Nefes21.model('narrators', narratorSchema);

module.exports = Narrator;