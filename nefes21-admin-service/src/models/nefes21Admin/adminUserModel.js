"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');


const adminUserSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique : true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    surname : {
        type : String
    },
    email : {
        type : String,
        unique : true
    },
    role : {
        type : String
    }
});

adminUserSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified()) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

adminUserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}

const AdminUser = Nefes21Admin.model('admin_users', adminUserSchema);

module.exports = AdminUser;
