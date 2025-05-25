"use strict";

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const soundscapeHelper = require('../../helpers/soundscapeHelper');
const multer = require('multer');
const config = require('config');
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');

router.get('/', (req,res,next) => {
    const lang = req.query.lang;
    if(!lang) throw new ErrorHandler(400, 'Missing lang');

    soundscapeHelper.getDraftedSoundscapes(lang)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error)
        });
});

let storage = multer.diskStorage({
    destination: function(req, files, cb){
        cb(null, config.get('FilePaths.tempPath'));
    }
});
let upload = multer({storage : storage});

router.post('/', upload.fields([{
    name : 'soundscape-mp3', maxCount : 1
},{
    name : 'cover-image',  maxCount : 1
}
]), (req,res,next) => {
    try {        
        const soundscapeData = JSON.parse(req.body.soundscapeData);
        const {error} = validateSoundscape(soundscapeData);
        if(error) throw new Error(error.message);
    
        let coverImage, soundscapeFile;
        if (req.files['soundscape-mp3']) soundscapeFile = req.files['soundscape-mp3'][0];
        if (req.files['cover-image']) coverImage = req.files['cover-image'][0];

        switch(req.body.state){
            case 'new' :
                if (coverImage === undefined || soundscapeFile === undefined) {
                    throw new Error('NEW_STATE_REQUIRES_FILE');
                }

                soundscapeHelper.addNewSoundscape(soundscapeData, coverImage, soundscapeFile)
                    .then((draftedSounscape) => {
                        res.status(200).json(draftedSounscape);
                    });
                break;
            case 'draft' : 
                soundscapeHelper.editDraftedSoundscape(soundscapeData, coverImage, soundscapeFile)
                    .then((draftedSounscape) => {
                        res.status(200).json(draftedSounscape);
                    });
                break;
            case 'publish' : 
                soundscapeHelper.editPublishedSoundscape(soundscapeData, coverImage, soundscapeFile)
                    .then((soundscape) => {
                        res.status(200).json(soundscape);
                    });
                break;
            default : 
                throw new Error('WRONG_STATE_TYPE');
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/', (req,res,next) => {
    let soundscapeId = req.body.soundscape_id;
    if(!soundscapeId) throw new ErrorHandler(400, 'Missing id field');

    soundscapeHelper.deleteDraftedSoundscape(soundscapeId)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => {
            next(error);
        })
});


const validateSoundscape = (soundscape) => {
    const Schema = Joi.object({
        soundscape_id : Joi.string()
            .allow(''),
        soundscape_title : Joi.string()
            .required(),
        soundscape_isFree : Joi.boolean()
            .required(''),
        soundscape_isValid : Joi.boolean()
            .required(),
        language : Joi.string()
            .required()
    }).unknown(true);

    return Schema.validate(soundscape);
}


module.exports = router;