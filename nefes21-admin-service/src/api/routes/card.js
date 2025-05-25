"use strict";

const express = require('express');
const router = express.Router();
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const cardHelper = require('../../helpers/cardHelper');
const Joi = require('joi');

router.get('/', (req,res,next) => {
    const lang = req.query.lang;
    if(!lang) throw new ErrorHandler(400, 'Missing field');

    cardHelper.getCards(lang)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/:deck_id', (req, res, next) => {
    const lang = req.query.lang;
    const deck_id = req.params.deck_id;
    if(!lang || !deck_id) throw new ErrorHandler(400, 'Missing lang field');
    
    const cards = req.body.card_list;
    const {error} = validateCards(cards);
    if(error) throw new ErrorHandler(400, error.message);
    
    cardHelper.publishCards(cards, deck_id, lang)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

const validateCards = (cards) => {
    const Schema = Joi.array().items(Joi.object({
        card_id : Joi.string()
            .required(),
        card_title : Joi.string()
            .required(),
        card_description : Joi.string()
            .required(),
        content_id : Joi.string()
            .allow(''),
        deck_id : Joi.string()
            .required(),
        isDailyAvailable : Joi.string()
            .required(),
        language : Joi.string()
            .required()
    }));

    return Schema.validate(cards);
}

module.exports = router;