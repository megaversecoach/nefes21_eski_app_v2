"use strict";

const express = require('express');
const router = express.Router();
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const categoryHelper = require('../../helpers/categoryHelper');
const Joi = require('joi');

router.get('/dimension',(req,res,next) => {
    let lang = req.query.lang;
    if(!lang) throw new ErrorHandler(400,'Missing lang field');

    categoryHelper.getCategories(lang)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

router.get('/quick-start',(req,res,next) => {
    let lang = req.query.lang;
    if(!lang) throw new ErrorHandler(400,'Missing lang field');

    categoryHelper.getQuickStartCategories(lang)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/dimension/:dimension_id', (req, res, next) => {
    let lang = req.query.lang;
    let dimension_id = req.params.dimension_id;
    if(!lang) throw new ErrorHandler(400, 'Missing lang field');

    let categories = req.body.categories;
    const {error} = valiateCategories(categories);
    if(error) throw new ErrorHandler(400, error.message);

    categoryHelper.publishCategories(categories, dimension_id, lang)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => {
            next(error);
        });
});

const valiateCategories = (categories) => {
    const Schema = Joi.array().items(Joi.object({
        category_id : Joi.string()
            .required(),
        category_label : Joi.string()
            .required(),
        category_description : Joi.string()
            .required(),
        dimension_id : Joi.string()
            .required(),
        orderInDimension : Joi.number()
            .required(),
        language : Joi.string()
            .required()
    }));

    return Schema.validate(categories);
}



module.exports = router;