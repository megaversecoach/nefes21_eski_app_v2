"use strict";

const express = require('express');
const router = express.Router();
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const contentHelper = require('../../helpers/contentHelper');
const Joi = require('joi');
const multer = require('multer');
const config = require('config');

router.get('/', (req, res, next) => {
    let lang = req.query.lang;
    if (!lang) throw new ErrorHandler(400, "Missing lang field");

    contentHelper.getDraftedContents(lang)
        .then((contents) => {
            res.status(200).json(contents);
        })
        .catch((error) => {
            next(error);
        });
});

router.get('/:content_id', (req, res, next) => {
    const contentId = req.params.content_id;
    if (!contentId) throw new ErrorHandler(400, "Missing field");

    contentHelper.getDraftedContentsById(contentId)
        .then((content) => {
            res.status(200).json(content);
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
let upload = multer({storage: storage});

router.post('/', upload.fields([{
    name : 'content-cover', maxCount : 1
}, {
    name : 'content-showcase', maxCount : 1
}
]), (req,res,next) => {
    try{
        const contentData = JSON.parse(req.body.contentData);

        const {error} = validateContent(contentData);
        if (error) throw new ErrorHandler(400, error.message);

        let coverPic, showcasePic;
        if(req.files['content-cover']) coverPic = req.files['content-cover'][0];
        if(req.files['content-showcase']) showcasePic = req.files['content-showcase'][0];

            switch (req.body.state){
                case 'new': 
                    if(coverPic === undefined || showcasePic === undefined){
                        throw new ErrorHandler(400, 'NEW_STATE_REQUIRES_IMAGE');
                    }
                    contentHelper.addNewDraftContent(contentData, coverPic, showcasePic)
                        .then((data) => {
                            res.status(200).json(data)
                        });
                    break;
                case 'draft' : 
                    contentHelper.editDraftedContent(contentData, coverPic, showcasePic)
                        .then((data) => {
                            res.status(200).json(data)
                        });
                    break;
                case 'publish' : 
                    contentHelper.editPublishedContent(contentData, coverPic, showcasePic)
                        .then((data) => {
                            res.status(200).json(data)
                        });
                    break;
                default : 
                    throw new ErrorHandler(400, 'WRONG_STATE_TYPE');
            }
    }catch (error){
        next(error);
    }
});

router.delete('/', (req,res,next) => {
    const contentId = req.body.content_id;
    if(!contentId) throw new ErrorHandler(400, 'Mising id field');

    contentHelper.deleteDraftedContent(contentId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        })
});

const validateContent = (content) => {
    const Schema = Joi.object({
        content_id : Joi.string()
            .allow(''),
        content_title : Joi.string()
            .required(),
        content_description : Joi.string()
            .required(),
        content_type_id : Joi.string()
            .required(),
        isMultiTrack : Joi.boolean()
            .allow(''),
        content_duration : Joi.number()
            .allow('',null),
        author_id : Joi.string()
            .required(),
        content_isNew : Joi.boolean()
            .required(),
        ageSegment : Joi.string()
            .required(),
        genderSegment : Joi.string()
            .required(),
        dateCreated : Joi.number()
            .allow(''),
        content_isValid : Joi.boolean()
            .required(),
        content_version : Joi.number()
            .required(),
        language : Joi.string()
            .required()
    }).unknown(true);
    
    return Schema.validate(content);
}

module.exports = router;