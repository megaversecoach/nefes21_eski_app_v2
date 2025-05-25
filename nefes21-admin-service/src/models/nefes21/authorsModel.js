"use strict"

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const authorSchema = new mongoose.Schema({
    author_id: {
        type: String,
        required: true
    },
    author_label: {
        type: String,
        required: true
    },
    author_name: {
        type: String,
        required: true
    },
    author_surname: {
        type: String,
        required: true
    },
    author_title: {
        type: String
    },
    author_info: {
        type: String
    },
    author_position: {
        type: String
    },
    profilePicUrl: {
        type: String
    },
    headerImageUrl: {
        type: String
    },
    isConsulting: {
        type: Boolean
    },
    language: {
        type: String
    }
});

const Authors = Nefes21.model('authors', authorSchema);

module.exports = Authors;