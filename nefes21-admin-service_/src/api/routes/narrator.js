"use strict";

const express = require('express');
const router = express.Router();
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const narratorHelper = require('../../helpers/narratorHelper');
const Joi = require('joi');

router.get('/', (req, res, next) => {
    let lang = req.query.lang;
    if (!lang) throw new ErrorHandler(400, "Missing lang field");

    narratorHelper.getNarrators(lang)
        .then((narrators) => {
            res.status(200).json(narrators);
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/', (req,res,next) => {
    const {error} = validateNarrator(req.body);
    if(error) throw new ErrorHandler(400, error.message);

   narratorHelper.publishNarrator(req.body.narrator_id)
       .then((narrator) => {
           res.status(200).json(narrator);
       })
       .catch((error) => {
           next(error);
       });
});

const validateNarrator = (narrator) => {
    const Schema = Joi.object({
        narrator_id : Joi.string()
            .required()
    });

    return Schema.validate(narrator);
}

module.exports = router;