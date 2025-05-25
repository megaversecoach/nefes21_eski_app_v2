"use strict";

const mongoose = require('mongoose');
const { Nefes21, Nefes21Admin, Nefes21Analytics } = require('../../config/dbConnection');

const uxSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    meditation_experience: {
        type: String
    },
    goals: {
        type: Array
    },
    mood_segments: {
        type: Array
    },
    onboarding_status: {
        type: String
    },
    isPushPermitted: {
        type: Boolean
    },
    isPushSubscribed: {
        type: Boolean,
        default: true
    },
    isEmailSubscribed: {
        type: Boolean,
        default: true
    },
    isMyplanShown: {
        type: Boolean,
        default: false
    },
    myplan_dateCreated: {
        type: Number
    },
    push_notification: {
        type: Array
    },
    reminders: {
        type: Array
    },
    favourites: {
        type: Array
    },
    mood_checkins: {
        type: Array
    },
    track_progressions: {
        type: Array
    },
    part_progressions: {
        type: Array
    },
    dimension_ratings: {
        type: Array
    },
    inapp_messages: {
        type: Array
    }
});

const UserExperience = Nefes21.model('user_experiences', uxSchema);

module.exports = UserExperience;
