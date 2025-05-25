"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const programLabelSchema = new mongoose.Schema({
    program_label_id : {
        type : String,
        require : true   
    },
    program_label : {
        type : String,
        require : true  
    },
    primaryColor : {
        type : String,
        require : true  
    },
    secondaryColor : {
        type : String,
        require : true  
    },
    language : {
        type : String,
        require : true  
    }
});

const ProgramLabel = Nefes21.model('program_labels', programLabelSchema);

module.exports = ProgramLabel;