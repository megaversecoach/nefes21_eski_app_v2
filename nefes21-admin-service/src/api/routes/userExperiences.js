"use strict";

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const userHelper = require('../../helpers/userHelper');

router.get('/:uuid', (req,res,next) => {
    const uuid = req.params.uuid;
    if(!uuid) throw new ErrorHandler(400, "Missing uuid");

    userHelper.getUserExperienceByUuid(uuid)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;