"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const userSchema = new mongoose.Schema({
    uuid : {
        type : String,
        unique : true
    },
    email : {
        type : String
    },
    name : {
        type : String
    },
    age : {
        type : Number
    },
    gender : {
        type : String
    },
    isProfilePicSet : {
        type : Boolean,
        default : false
    },
    isPasswordSet : {
        type : Boolean,
        default : false
    },
    facebook_account : {
        type : Object
    },
    google_account : {
        type : Object
    },
    apple_account : {
        type : Object
    },
    dateCreated : {
        type : Number
    },
    app_language : {
        type : String
    },
    device_language : {
        type : String
    },
    subscriptions : {
        type : Object
    },
    enrolled_programs : {
        type : Array
    },
    referal_code : {
        type : String
    },
    offer : {
        type : String
    },
    offer_expiration_date : {
        type : String
    }
});

const User = Nefes21.model('users', userSchema);

module.exports = User;

