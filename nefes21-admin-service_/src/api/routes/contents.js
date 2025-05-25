"use strict";

const express = require('express');
const router = express.Router();
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const contentHelper = require('../../helpers/contentHelper');
const Joi = require('joi');

router.get('/', (req, res, next) => {
    let lang = req.query.lang;
    if (!lang) throw new ErrorHandler(400, "Missing lang field");

    contentHelper.getContents(lang)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/', (req,res,next) => {
    const {error} = validateContent(req.body);
    if(error) throw new ErrorHandler(400, error.message); 

    contentHelper.publishContent(req.body.content_id)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        })
})

const validateContent = (content) => {
    const Schema = Joi.object({
        content_id : Joi.string()
            .required()
    });

    return Schema.validate(content);
}

module.exports = router;