"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const deckSchema = new mongoose.Schema({
    deck_id : {
        type : String,
        required : true
    },
    deck_title : {
        type : String,
        required : true
    },
    dailyTag : {
        type : String
    },
    showcaseImageUrl : {
        type : String,
        required : true
    },
    cardFrontImageUrl : {
        type : String,
        required : true
    },
    cardBackImageUrl : {
        type : String,
        required : true
    },
    backgroundImageUrl : {
        type : String,
        required : true
    },
    primaryColor : {
        type : String
    },
    orderInSection : {
        type : Number,
        required : true
    },
    language : {
        type : String,
        required : true
    },
    deck_isValid : {
        type : Boolean,
        required : true
    }
});


const Deck = Nefes21.model('decks', deckSchema);

module.exports = Deck;