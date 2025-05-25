"use strict"

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const loginHelper = require('../../helpers/authorizeHelper');
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');

router.post('/', (req,res,next) => {
    const {error} = validateLoginCredentials(req.body);
    if(error) throw new ErrorHandler(400,error.message);
    
    loginHelper.authenticateUser(req.body)
        .then((user) => {
            res.status(200).json(user)
        })
        .catch((error) => {
            next(error)
        })
})

const validateLoginCredentials = (userCredentials) => {
    const Schema = Joi.object({
        username : Joi.string()
            .required(),
        password : Joi.string()
            .required()
    });

    return Schema.validate(userCredentials);
}

module.exports = router;