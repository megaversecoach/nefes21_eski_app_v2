"use strict";

const express = require('express');
const router = express.Router();
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const authorHelper = require('../../helpers/authorHelper');
const Joi = require('joi');

router.get('/', (req, res, next) => {
    let lang = req.query.lang;
    if (!lang) throw new ErrorHandler(400, "Missing lang field");

    authorHelper.getAuthors(lang)
        .then((authors) => {
            res.status(200).json(authors);
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/', (req, res, next) => {
    const {error} = validateAuthor(req.body);
    if(error) throw new ErrorHandler(400, error.message);
    
    authorHelper.publishAuthor(req.body.author_id)
        .then((authorData) => {
            res.status(200).json(authorData);
        })
        .catch((error) => {
            next(error)
        });
});

const validateAuthor = (author) => {
    const Schema = Joi.object({
        author_id : Joi.string()
            .required()
    });
    
    return Schema.validate(author);
}


module.exports = router;
