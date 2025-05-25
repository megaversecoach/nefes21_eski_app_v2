"use strict";

const Track = require('../models/nefes21/trackModel');
const DraftedTrack = require('../models/nefes21Admin/draftedTrackModel');
const DraftedContent = require('../models/nefes21Admin/draftedContent');
const { ErrorHandler, handleError } = require('../middleware/errorHandler');
const path = require('path');
const fs = require('fs');
const config = require('config');

const getTracks = (contentId) => {
    return new Promise((resolve, reject) => {
        const query = { "content_id": contentId };
        const projection = { _id: 0, language: 0, __v : 0 };
        const response = (err, tracks) => {
            if (err) return reject(new ErrorHandler(500, err.message));
            resolve(tracks);
        }
        Track.find(query, projection, response);
    });
}

const getDraftedTracks = (contentId) => {
    return new Promise((resolve, reject) => {
        const query = { "content_id": contentId };
        const projection = { _id: 0, language: 0, __v : 0};
        const response = (err, drafts) => {
            if (err) return reject(new ErrorHandler(500, err.message));
            resolve(drafts);
        }
        DraftedTrack.find(query, projection, response);
    });
}

function addNewTrack(trackData, mp3File) {
    return new Promise(async (resolve, reject) => {
        try {
            let contentId = trackData.content_id;
            let trackId = `${contentId}-${Math.floor(100000 + Math.random() * 900000)}`;
            trackData = Object.assign(trackData, { "track_id": trackId });

            let destinationPath = path.join(config.get(`FilePaths.drafTracks`), `${trackId}.mp3`);
            await fs.rename(mp3File.path, destinationPath, async(err) => {
                if(err) return reject(new ErrorHandler(400, err.message));

                trackData.source_id = Math.floor(100000 + Math.random() * 900000);
                
                await DraftedTrack.create(trackData);
    
                await updateContentByTracks(contentId)
                
                resolve({ success: true });
            });
        } catch (error) {
            throw new ErrorHandler(500, error.message);
        }
    });
}

function editTracks(trackData, mp3File, trackList) {
    return new Promise(async (resolve, reject) => {
        if (trackData !== undefined) {
            let trackId = trackData.track_id;

            if (mp3File !== undefined) {
                const oldDraft = await DraftedTrack.findOne({ "track_id": trackId }, (err) => {
                    if (err) return reject(new ErrorHandler(500, err.message));
                });

                const trackSourceUrl = `${config.get('FilePaths.drafTracks')}/${oldDraft.track_id}.mp3`;
                if (fs.existsSync(trackSourceUrl)) {
                    await fs.unlink(trackSourceUrl);
                }

                let destinationPath = path.join(config.get(`FilePaths.drafTracks`), `${trackId}.mp3`);
                fs.rename(mp3File.path, destinationPath, (err) => {
                    if (err) return resolve(new ErrorHandler(500, err.message));
                });

                trackData.source_id = Math.floor(100000 + Math.random() * 900000);
            }

            await DraftedTrack.findOneAndUpdate({ "track_id": trackId }, trackData);
    
            await updateContentByTracks(trackData.content_id)
                   
            resolve({ success: true });
        } else {
            for (let item of trackList) {
                let track = await DraftedTrack.findOneAndUpdate({ "track_id":  item.track_id }, item,
                    {
                        upsert: true,
                        new: true,
                        setDefaultsOnInsert: true
                    }).exec();
            }
            resolve({ success: true });
        }
    });
}

async function deleteDraftedTrack(trackId) {
    try {
        let trackData = await DraftedTrack.findOne({'track_id' : trackId}, (err) =>{
            if(err) throw new ErrorHandler(500, CONTENT_CANT_UPDATED);
        });

        let mp3Path = `${config.get('FilePaths.drafTracks')}/${trackId}.mp3`;
        if (mp3Path.includes('/drafts') && fs.existsSync(mp3Path)) {
            fs.unlink(mp3Path, function (err) {
                if (err) throw new Error(err.message);
            });
        }
        
        const trackObject = await DraftedTrack.findOneAndDelete({ "track_id": trackId }, (err, doc) => {
            if (err) throw new Error(err.message);
        });

        let isContentUpdated = await updateContentByTracks(trackData.content_id)

        return { success: true };
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
}

function updateContentByTracks(contentId) {
    return new Promise(async(resolve, reject) => {
        let contentDuration = 0;
        let validTracks = [], 
            freeTracks = [];

        const tracks = await DraftedTrack.find({ "content_id": contentId }, (err) => {
            if (err) return reject(new Error(err.message));
        });

        for(let item of tracks){
            if(item.track_isValid === true) {
                validTracks.push(item);

                if(item.track_isFree === true) freeTracks.push(item);

                contentDuration = contentDuration + item.track_duration;
            }
        }

        let isMultiTrack = (validTracks.length > 1) ? true : false;
        let isFree = (freeTracks.length >= 1) ? true : false

        const content = await DraftedContent.findOneAndUpdate({'content_id': contentId}, 
            {
                "content_duration" : contentDuration,
                "content_isFree" : isFree,
                "isMultiTrack" : isMultiTrack
            }, (err) => {
                if (err) return reject(new Error(err.message));
                resolve(true);
        });
    });
}

module.exports = {
    getTracks,
    getDraftedTracks,
    addNewTrack,
    editTracks,
    deleteDraftedTrack
}