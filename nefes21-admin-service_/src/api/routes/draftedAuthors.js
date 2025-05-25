"use strict";

const express = require('express');
const router = express.Router();
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const authorHelper = require('../../helpers/authorHelper');
const multer = require('multer');
const config = require('config');
const Joi = require('joi');

router.get('/', (req, res, next) => {
    const lang = req.query.lang;
    if (!lang) {
        throw new ErrorHandler(400, "Missing lang field");
    }
    authorHelper.getDraftedAuthors(lang)
        .then((authors) => {
            res.status(200).json(authors);
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
    name: 'profile-pic', maxCount: 1
}, {
    name: 'header-image', maxCount: 1
}
]), (req, res, next) => {
    const authorData = JSON.parse(req.body.authorData);
    const {error} = validateAuthor(authorData);
    if(error) throw new ErrorHandler(400, error.message);
    
    let profilePicture, headerImage;
    if (req.files['profile-pic']) profilePicture = req.files['profile-pic'][0];
    if (req.files['header-image']) headerImage = req.files['header-image'][0];

    switch (req.body.state) {
        case 'new' :
            if (profilePicture === undefined || headerImage === undefined) {
                throw new ErrorHandler(400, 'NEW_STATE_REQUIRES_IMAGE');
            }
            authorHelper.addNewDraftedAuthor(authorData, profilePicture, headerImage)
                .then((draftedAuthorObject) => {
                    res.status(200).json(draftedAuthorObject);
                })
                .catch((error) => {
                    next(error);
                });
            break;
        case  'draft' :
            authorHelper.editDraftedAuthor(authorData, profilePicture, headerImage)
                .then((draftedAuthorObject) => {
                    res.status(200).json(draftedAuthorObject);
                })
                .catch((error) => {
                    next(error);
                });
            break;
        case 'publish' :
            authorHelper.editPublishAuthor(authorData, profilePicture, headerImage)
                .then((draftedAuthorObject) => {
                    res.status(200).json(draftedAuthorObject);
                })
                .catch((error) => {
                    next(error);
                });
            break;
        default :
            throw new ErrorHandler(400, 'WRONG_STATE_TYPE');
    }
});

router.delete('/', (req, res, next) => {
    let authorId = req.body.author_id;
    if(!authorId){
        throw new ErrorHandler(400, 'Missing id field');
    }

    authorHelper.deleteDraftedAuthor(authorId)
        .then((data) => {
           res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

const validateAuthor = (author) => {
    const Schema = Joi.object({
        author_id : Joi.string()
            .allow(''),
        author_label : Joi.string()
            .required(),
        author_name :  Joi.string()
            .required(),
        author_surname : Joi.string()
            .required(),
        author_title : Joi.string()
            .required(),
        author_info : Joi.string()
            .required(),
        author_position : Joi.string()
            .allow(''),
        isConsulting : Joi.boolean()
            .required(),
        language : Joi.string()
            .required()
    }).unknown(true);

    return Schema.validate(author);
}
 
module.exports = router;