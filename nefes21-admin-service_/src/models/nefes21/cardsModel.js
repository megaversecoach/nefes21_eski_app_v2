"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const cardSchema = new mongoose.Schema({
    card_id : {
        type : String,
        required : true
    },
    card_title : {
        type : String,
        required : true
    },
    card_description : {
        type : String,
        required : true
    },
    content_id : {
        type : String
    },
    deck_id : {
        type : String,
        required : true
    },
    isDailyAvailable : {
        type : String
    },
    language : {
        type : String,
        required : true
    }
});


const Card = Nefes21.model('cards', cardSchema);

module.exports = Card;