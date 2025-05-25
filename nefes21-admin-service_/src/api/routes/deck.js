"use strict";

const express = require('express');
const router = express.Router();
const { ErrorHandler, handleError } = require('../../middleware/errorHandler');
const cardHelper = require('../../helpers/cardHelper');
const Joi = require('joi');
const multer = require('multer');
const config = require('config');

router.get('/', (req, res, next) => {
    const lang = req.query.lang;
    if (!lang) throw new ErrorHandler(400, 'Missing field');

    cardHelper.getDecks(lang)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

let storage = multer.diskStorage({
    destination: function (req, files, cb) {
        cb(null, config.get('FilePaths.tempPath'))
    }
});
let upload = multer({ storage: storage });

router.post('/', upload.fields([
    {
        name: 'showcase-image', maxCount: 1
    }, {
        name: 'front-image', maxCount: 1
    }, {
        name: 'back-image', maxCount: 1
    }, {
        name: 'background-image', maxCount: 1
    }
]), (req, res, next) => {
    const deckData = JSON.parse(req.body.deckData);
    const { error } = validateDeck(deckData);
    if (error) throw new ErrorHandler(400, error.message);
    
    cardHelper.publishDecks(deckData, req.files)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => {
            next(error);
        });
});

const validateDeck = (deck) => {
    const Schema = Joi.object({
        deck_id: Joi.string()
            .allow('', null),
        deck_title: Joi.string()
            .required(),
        dailyTag: Joi.string(),
        showcaseImageUrl: Joi.string()
            .allow('', null),
        cardFrontImageUrl: Joi.string()
            .allow('', null),
        cardBackImageUrl: Joi.string()
            .allow('', null),
        backgroundImageUrl: Joi.string()
            .allow('', null),
        primaryColor: Joi.string(),
        orderInSection: Joi.number()
            .required(),
        deck_isValid : Joi.boolean()
            .required(),
        language: Joi.string()
            .required()
    });

    return Schema.validate(deck);
}
module.exports = router;