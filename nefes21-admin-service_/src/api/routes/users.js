"use strict";

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const userHelper = require('../../helpers/userHelper');

router.get('/', (req,res,next) => {
    const uuid = req.query.uuid;
    const email = req.query.email;
    const referralCode = req.query['referralCode'];
    if(!uuid && !email && !referralCode) throw new ErrorHandler(400, 'Missing query parameter');

    userHelper.getUserCredentials(uuid, email, referralCode)
        .then((data) => {
            if(!data) throw new ErrorHandler(404, 'Not Found')
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;