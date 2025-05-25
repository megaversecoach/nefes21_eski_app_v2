"use strict";

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const soundscapeHelper = require('../../helpers/soundscapeHelper');
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');

router.get('/', (req,res,next) => {
    const lang = req.query.lang;
    if(!lang) throw new ErrorHandler(400, 'Missing lang');

    soundscapeHelper.getSoundscapes(lang)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error)
        });
});

router.post('/', (req,res,next) => {
    const {error} = validateSoundscape(req.body);
    if(error) throw new ErrorHandler(400, error.message);

    soundscapeHelper.publishSoundscape(req.body.soundscape_id)
        .then((soundscape) => {
            res.status(200).json(soundscape);
        })
        .catch((error) => {
            next(error);
        })
});

const validateSoundscape = (soundscape) => {
    const Schema = Joi.object({
        soundscape_id : Joi.string()
            .required()
    });

    return Schema.validate(soundscape);
}

module.exports = router;