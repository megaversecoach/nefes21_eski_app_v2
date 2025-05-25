"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const programLayoutSchema = new mongoose.Schema({
    program_id : {
        type : String,
        required : true
    },
    program_isDiscounted : {
        type : Boolean,
        required : true
    },
    program_label_id : {
        type : String
    },
    orderInSection : {
        type : Number,
        required : true
    },
    language : {
        type : String,
        required : true
    }
});

const ProgramLayout = Nefes21.model('program_layouts', programLayoutSchema);

module.exports = ProgramLayout;