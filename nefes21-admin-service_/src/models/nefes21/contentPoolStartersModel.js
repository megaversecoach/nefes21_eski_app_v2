"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection'); 

const contentPoolStartersSchema = new mongoose.Schema({
    content_id : {
        type : String,
        required : true
    },
    orderInSection : {
        type : Number,
        required : true
    },
    section_id : {
        type : String,
        required : true
    },
    language :  {
        type : String,
        required : true
    }
});

const ContentPoolStarter = Nefes21.model('contentpool_starters', contentPoolStartersSchema);

module.exports = ContentPoolStarter;