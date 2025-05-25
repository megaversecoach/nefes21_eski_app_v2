"use strict";

const expressJwt = require('express-jwt');
const config = require('config');

function jwt(){
    const secret = config.get('Jwt.secretKey');
    return expressJwt({secret, algorithms:['HS256']}).unless({
        path : [
            '/v2/login'
        ]
    });
}

module.exports = jwt;