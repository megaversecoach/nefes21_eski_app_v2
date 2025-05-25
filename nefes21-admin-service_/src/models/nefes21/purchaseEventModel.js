"use strict"

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const purchaseEventsSchema = new mongoose.Schema({
    payment_method : {
        type: String,
    },
    transaction_id: {
        type: String,
    },
    dateCreated : {
        type: Number,
    },
    notification_type: {
        type: String,
    },
    event_type : {
        type: String
    },
    event_label: {
        type: String
    },
    event_state: {
        type: String
    },
    uuid: {
        type: String
    }
});

const purchaseEvents = Nefes21Analytics.model('purchase_events', purchaseEventsSchema);

module.exports = purchaseEvents;