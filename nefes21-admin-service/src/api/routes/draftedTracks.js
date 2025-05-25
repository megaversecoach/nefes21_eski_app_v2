"use strict";

const express = require('express');
const router = express.Router();
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const trackHelper = require('../../helpers/trackHelper');
const Joi = require('joi');
const multer = require('multer');
const config = require('config');

router.get('/', (req, res, next) => {
    let contentId = req.query.content_id;
    if (!contentId) throw new ErrorHandler(400, "Missing id field");

    trackHelper.getDraftedTracks(contentId)
        .then((tracks) => {
            res.status(200).json(tracks);
        })
        .catch((error) => {
            next(error);
        });
});

let storage = multer.diskStorage({
    destination: function(req, files, cb){
        cb(null, config.get('FilePaths.tempPath'));
    }
});
let upload = multer({storage : storage});

router.post('/', upload.fields([{
    name : 'track-mp3', maxCount : 1
}]), (req, res, next) => {
    try {
        let trackList, trackData;
        if(req.body.trackData !== undefined) trackData = JSON.parse(req.body.trackData);
        if(req.body.trackList !== undefined) trackList = JSON.parse(req.body.trackList);
        
        const {error} = validateTracks(trackData);
        if(error) throw new Error(error.message);
        
        let trackFile;
        if(req.files['track-mp3']) trackFile = req.files['track-mp3'][0];

        switch(req.body.state){
            case 'new' : 
                if (trackFile === undefined) throw new Error('NEW_STATE_REQUIRES_FILE');

                trackHelper.addNewTrack(trackData, trackFile)
                    .then((data) => {
                        res.status(200).json(data);
                    });
                break;
            case 'draft' : 
                trackHelper.editTracks(trackData, trackFile, trackList)
                    .then((data) => {
                        res.status(200).json(data);
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
    let trackId = req.body.track_id;
    if(!trackId) throw new ErrorHandler(400, 'Missing track_id field');

    trackHelper.deleteDraftedTrack(trackId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        })
});

const validateTracks = (tracks) => {
    const Schema = Joi.object({
        tracks_id : Joi.string()
            .allow(''),
        track_title : Joi.string()
            .required(),
        track_label : Joi.string()
            .required(),
        track_duration : Joi.number()
            .allow('', null),
        track_isFree : Joi.boolean()
            .required(),
        orderInContent : Joi.number()
            .required(),
        content_id : Joi.string()
            .required(),
        narrator_id : Joi.string()
            .required(),
        soundscape_id : Joi.string()
            .required(),
        soundscape_volume : Joi.number()
            .required(),
        track_isValid : Joi.boolean()
            .required(),
        track_version : Joi.number()
            .allow('',null),
        language : Joi.string()
            .allow('',null)
    }).unknown(true);

    return Schema.validate(tracks);
}

module.exports = router;