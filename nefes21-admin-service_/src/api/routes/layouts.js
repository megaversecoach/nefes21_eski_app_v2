"use strict";

const express = require('express');
const router = express.Router();
const { ErrorHandler, handleError } = require('../../middleware/errorHandler');
const layoutHelper = require('../../helpers/layoutHelper');
const Joi = require('joi');

router.get('/dimension', (req, res, next) => {
    const lang = req.query.lang;
    if (!lang) throw new ErrorHandler(400, 'Missing field lang');

    layoutHelper.getDimensionLayout(lang)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/dimension/:dimension_id', (req, res, next) => {
    let dimension_id = req.params.dimension_id;
    let lang = req.query.lang;
    
    let dimensionList = req.body.dimension_layouts;
   
    const {error} = validateDimensionLayout(dimensionList);
    if(error) throw new ErrorHandler(400, error.message);
    
    if(!dimension_id && !lang) throw new ErrorHandler(400, 'Missing field');

    layoutHelper.publishDimensionLayout(dimension_id, lang, dimensionList)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

router.get('/quick-start', (req, res, next) => {
    const lang = req.query.lang;
    if (!lang) throw new ErrorHandler(400, 'Missing field');

    layoutHelper.getQuickStartLayout(lang)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/quick-start/:qs_id', (req, res, next) => {
    const lang = req.query.lang;
    const quickStartId = req.params.qs_id;
    if(!lang || !quickStartId) throw new ErrorHandler(400, 'Missing field');

    const qsList = req.body.qs_layout;
    const {error} = validateQuickStartLayout(qsList);
    if(error) throw new ErrorHandler(400, error.message);

    layoutHelper.publishQuickStartLayout(lang, qsList, quickStartId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        })
});

router.get('/mood-checkin', (req, res, next) => {
    const lang = req.query.lang;
    if (!lang) throw new ErrorHandler(400, 'Missing field');

    layoutHelper.getMoodCheckInLayout(lang)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        })
});

router.post('/mood-checkin/:mood_id', (req, res, next) => {
    const lang = req.query.lang;
    const moodId = req.params.mood_id;
    if (!lang || !moodId) throw new ErrorHandler(400, 'Missing field');

    const moodList = req.body.mood_checkin_layout;
    const {error} = validateMoodCheckinLayout(moodList);
    if(error) throw new ErrorHandler(400, error.message);

    layoutHelper.publishMoodCheckinLayout(lang, moodList, moodId)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => {
            next(error);
        });
});

const validateDimensionLayout = (dimensionLayout) => {
    const Schema = Joi.array().items(Joi.object({
        content_id : Joi.string()
            .allow(''),
        soundscape_id : Joi.string()
            .allow('', null),
        showcase_type_id : Joi.string()
            .allow('', null),
        orderInCategory : Joi.number()
            .required(),
        category_id : Joi.string()
            .required(),
        dimension_id : Joi.string()
            .required(),
        language : Joi.string()
            .required()
    }));

    return Schema.validate(dimensionLayout);
}

const validateQuickStartLayout = (qsLayout) => {
    const Schema = Joi.array().items(Joi.object({
        content_id : Joi.string()
            .required(),
        qs_category_id : Joi.string()
            .required(),
        orderInCategory : Joi.number()
            .required(),
        language : Joi.string()
    }));

    return Schema.validate(qsLayout);
}

const validateMoodCheckinLayout = (moods) => {
    const Schema = Joi.array().items(Joi.object({
        content_id : Joi.string()
            .required(),
        mood_id : Joi.string()
            .required(),
        language : Joi.string()
    }));

    return Schema.validate(moods);
}

module.exports = router;