"use strict";

const express = require('express');
const router = express.Router();
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const narratorHelper = require('../../helpers/narratorHelper');
const multer = require('multer');
const config = require('config');
const Joi = require('joi');

router.get('/', (req, res, next) => {
    const lang = req.query.lang;
    if (!lang) throw new ErrorHandler(400, 'Missing lang filed');

    narratorHelper.getDraftedNarrators(lang)
        .then((narrators) => {
            res.status(200).json(narrators);
        })
        .catch((error) => {
            next(error);
        });
});

let storage = multer.diskStorage({
    destination: function (req, files, cb) {
        cb(null, config.get('FilePaths.tempPath'));
    }
});
let upload = multer({storage: storage}).array('profile-pic');

router.post('/', upload, (req, res, next) => {
    let narratorData = JSON.parse(req.body.narratorData);
    
    const {error} = validateNarrator(narratorData);
    if(error) throw new ErrorHandler(400,error.message);

    let profilePicture;
    if (req.files.length !== 0) {
        profilePicture = req.files[0];
    }
    
    try {
        switch (req.body.state) {
            case 'new':
                if (profilePicture === undefined) throw new ErrorHandler(400, 'NEW_STATE_REQUIRES_IMAGE');
                
                narratorHelper.addNewDraftedNarrator(narratorData, profilePicture)
                    .then((drafted) => {
                        res.status(200).json(drafted);
                    })
                break;
            case 'draft' :
                narratorHelper.editDraftedNarrator(narratorData, profilePicture)
                    .then((drafted) => {
                        res.status(200).json(drafted);
                    })
                break;
            case 'publish' :
                narratorHelper.editPublishedNarrator(narratorData, profilePicture)
                    .then((drafted) => {
                        res.status(200).json(drafted);
                    })
                break;
            default :
                throw new ErrorHandler(400, 'WRONG_STATE_TYPE');
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/', (req,res,next) => {
    let narratorId = req.body.narrator_id;
    if(!narratorId){
        throw new ErrorHandler(400,'Missing id field');
    }

    narratorHelper.deleteDraftedNarrator(narratorId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
           next(error);
        });
});

const validateNarrator = (narrator) => {
    const Schema = Joi.object({
        narrator_id : Joi.string()
            .allow(''),
        narrator_name : Joi.string()
            .required(),
        narrator_surname : Joi.string()
            .required(),
        narrator_title : Joi.string()
            .required(),
        narrator_info : Joi.string()
            .required(),
        language : Joi.string()
            .required()
    }).unknown(true);
    
    return Schema.validate(narrator);
}

module.exports = router;