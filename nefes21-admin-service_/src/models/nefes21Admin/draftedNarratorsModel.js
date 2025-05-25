"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const narratorSchema = new mongoose.Schema({
    narrator_id: {
        type: String
    },
    narrator_name: {
        type: String
    },
    narrator_surname: {
        type: String
    },
    narrator_title: {
        type: String
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

const DraftedNarrator = Nefes21Admin.model('drafted_narrators', narratorSchema);

module.exports = DraftedNarrator;