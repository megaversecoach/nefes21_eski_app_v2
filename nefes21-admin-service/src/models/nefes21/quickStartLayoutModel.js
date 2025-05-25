 "use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const qsLayoutSchema = new mongoose.Schema({
    content_id : {
        type : String,
        required : true
    },
    qs_category_id : {
        type : String,
        required : true
    },
    orderInCategory : {
        type : Number,
        required : true
    },
    language : {
        type : String,
        required : true
    }
});

const QuickStartLayout = Nefes21.model('quickstart_layouts', qsLayoutSchema);

module.exports = QuickStartLayout;