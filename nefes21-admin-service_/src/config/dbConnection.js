"use strict";

const mongoose = require('mongoose');
const config = require("config");

function connectDatabase(uri) {
    const db = mongoose.createConnection(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

    db.on('error', function (error) {
        console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`);
        db.close().catch(() => console.log(`MongoDB :: failed to close connection ${this.name}`));
    });

    db.on('connected', function () {
        mongoose.set('debug', function (col, method, query, doc) {
            //console.log(`MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(query)},${JSON.stringify(doc)})`);
        });
        console.log(`MongoDB :: connected ${this.name}`);
    });

    db.on('disconnected', function () {
        console.log(`MongoDB :: disconnected ${this.name}`);
    });

    return db;
}

const Nefes21 = connectDatabase(config.get('Db.nefes21URL'));
const Nefes21Admin = connectDatabase(config.get('Db.nefes21AdminURL'));
const Nefes21Analytics = connectDatabase(config.get('Db.nefes21AnalyticsURL'));

module.exports = {
    Nefes21,
    Nefes21Admin,
    Nefes21Analytics
}