"use strict";

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { ErrorHandler, handleError } = require('../../middleware/errorHandler');
const todayHelper = require('../../helpers/todayHelper');
const multer = require('multer');
const config = require('config');

router.get('/starters', (req, res, next) => {
    const lang = req.query.lang;
    if (!lang) throw new ErrorHandler(400, 'Missing lang field');

    todayHelper.getStarters(lang)
        .then((starters) => {
            res.status(200).json(starters);
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/starters', (req, res, next) => {
    const lang = req.query.lang;
    if (!lang) throw new Error(400, 'Missing lang field');

    const starters = req.body.starters;
    const { error } = validateStarters(starters);
    if (error) throw new ErrorHandler(400, error.message);

    todayHelper.publishStarters(starters, lang)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

router.get('/series', (req, res, next) => {
    const lang = req.query.lang;
    if (!lang) throw new ErrorHandler(400, 'Missing lang field');

    todayHelper.getSeries(lang)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/series/:dimension_id', (req, res, next) => {
    const lang = req.query.lang;
    const dimension_id = req.params.dimension_id;
    if (!lang || !dimension_id) throw new ErrorHandler(400, 'Missing lang field');

    const series = req.body.series;
    const { error } = validateSeries(series);
    if (error) throw new ErrorHandler(400, error.message);

    todayHelper.publishSeries(series, lang, dimension_id)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => {
            next(error);
        });
});

router.get('/showcases/personalized', (req, res, next) => {
    const lang = req.query.lang;
    if (!lang) throw new ErrorHandler(400, 'Missing lang field');

    todayHelper.getPersonalizedShowcases(lang)
        .then((showcases) => {
            res.status(200).json(showcases);
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/showcases/personalized/:dimension_id', (req, res, next) => {
    const lang = req.query.lang;
    const dimension_id = req.params.dimension_id;
    if (!lang || !dimension_id) throw new ErrorHandler(400, 'Missing lang field');

    const showcases = req.body.personalized_showcases;
    const { error } = validatePersonalizedShowcases(showcases);
    if (error) throw new ErrorHandler(400, error.message);

    todayHelper.publishPersonalizedShowcases(showcases, lang, dimension_id)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        })
});

router.get('/showcases/non-personalized', (req, res, next) => {
    const lang = req.query.lang;
    if (!lang) throw new ErrorHandler(400, 'Missing lang field');

    todayHelper.getNonPersonalizedShowcases(lang)
        .then((showcases) => {
            res.status(200).json(showcases);
        })
        .catch((error) => {
            next(error);
        })
});

let storage = multer.diskStorage({
    destination: function(req, files, cb){
        cb(null, config.get('FilePaths.showcases'));
    }
});
let upload = multer({storage : storage});


router.post('/showcases/non-personalized',upload.single('showcase-image'), (req, res, next) => {  
    let showcaseObject = JSON.parse(req.body.showcaseItemData) 
    const {error} = validateNonPersonalizedShowcases(showcaseObject);
    if(error) throw new ErrorHandler(400, error.message);

    todayHelper.publishNonPersonalizedShowceses(showcaseObject, req.file)
        .then((data) =>{
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

router.delete('/showcases/non-personalized', (req, res, next) => {
    const showcaseId  = req.body.showcase_id;
    if(!showcaseId) throw new ErrorHandler(400, "Missing id field");

    todayHelper.deleteNonPersonalizedShowcase(showcaseId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        })
});

const validatePersonalizedShowcases = (showcases) => {
    const Schema = Joi.array().items(Joi.object({
        content_id: Joi.string()
            .required(),
        dimension_id: Joi.string()
            .required(),
        language: Joi.string()
            .required()
    }));

    return Schema.validate(showcases);
}

const validateStarters = (starters) => {
    const Schema = Joi.array().items(Joi.object({
        content_id: Joi.string()
            .required(),
        orderInSection: Joi.number()
            .required(),
        section_id: Joi.string()
            .required(),
        language: Joi.string()
            .required()
    }));

    return Schema.validate(starters);
}

const validateSeries = (series) => {
    const Schema = Joi.array().items(Joi.object({
        content_id: Joi.string()
            .required(),
        dimension_id: Joi.string()
            .required(),
        section_id: Joi.string()
            .required(),
        language: Joi.string()
            .required()
    }));

    return Schema.validate(series);
}

const validateNonPersonalizedShowcases = (showcase) => {
    const Schema = Joi.object({
        showcase_id : Joi.string()
            .allow('', null),
        showcase_imageUrl : Joi.string()
            .allow('', null),
        action : Joi.string()
            .required(),
        actionUrl : Joi.string()
            .allow('', null),
        content_id : Joi.string()
            .allow('', null),
        priorityRating : Joi.number()
            .required(),
        showcase_type_id : Joi.string()
            .required(),
        method : Joi.string()
            .required(),
        showcase_isValid : Joi.boolean()
            .required(),
        showcase_isFree : Joi.boolean()
            .allow('', null),
        language : Joi.string()
            .required()
    });

    return Schema.validate(showcase);
}

module.exports = router;