"use strict";

const AdminUser = require('../models/nefes21Admin/adminUserModel');
const jwt = require('jsonwebtoken');
const config = require('config');
const {ErrorHandler, handleError} = require('../middleware/errorHandler');

function authenticateUser(userCredentials) {
    return new Promise(async (resolve, reject) => {
        const user = await AdminUser.findOne({"username": userCredentials.username});
        if (!user) {
            return reject(new ErrorHandler(401, 'AUTHENTICATION_FAILED'));
        } else {
            await user.comparePassword(userCredentials.password, (err, isMatch) => {
                if (err || !isMatch) {
                    return reject(new ErrorHandler(401, 'AUTHENTICATION_FAILED'));
                } else {
                    let token = jwt.sign({}, config.get('Jwt.secretKey'), {expiresIn: '1d'});
                    resolve({"username": user.username, "name" : user.name, "token": token, "role" : user.role});
                }
            });
        }
    });
}

module.exports = {
    authenticateUser
}
