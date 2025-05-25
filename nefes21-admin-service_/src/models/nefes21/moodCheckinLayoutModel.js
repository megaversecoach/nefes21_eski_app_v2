"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const moodCheckinLayoutSchema = new mongoose.Schema({
    content_id : {
        type : String
    },
    mood_id : {
        type : String
    },
    language : {
        type : String
    }
});

const MoodCheckinLayout = Nefes21.model('moodcheckin_layouts', moodCheckinLayoutSchema);

module.exports = MoodCheckinLayout;