"use strict";

const { ErrorHandler, handleError } = require('../middleware/errorHandler');
const Soundscape = require('../models/nefes21/soundscapeModel');
const DraftedSoundscape = require('../models/nefes21Admin/draftedSoundscapeModel');
const Identifier = require('../models/nefes21Admin/tableIdentifiersModel');
const DataVersion = require('../models/nefes21/dataVersionModel');
const path = require('path');
const config = require('config');
const fs = require('fs');

/**
 * @param {*} lang : language field for soundscape model.
 * @returns : soundscape array.
 */
const getSoundscapes = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, language: 0, soundscape_version: 0, __v: 0 };
        const response = (err, soundscapes) => {
            if (err) reject(new ErrorHandler(500, err.message));
            resolve(soundscapes);
        }
        Soundscape.find(query, projection, response);
    });
}

/**
 * @param {*} lang : language field for drafted soundscape model.
 * @returns : soundscape array.
 */
const getDraftedSoundscapes = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, language: 0, soundscape_version: 0, __v: 0 };
        const response = (err, draftedSoundscapes) => {
            if (err) reject(new ErrorHandler);
            resolve(draftedSoundscapes);
        }
        DraftedSoundscape.find(query, projection, response);
    });
}

/**
 * @description adds a new drafted soundscape to db, moves files temporary field 
 *  to related fields.
 * @param {*} soundscapeData : drafted soundscapes data.
 * @param {*} coverImage : soundscape cover image, jpg file.
 * @param {*} soundscapeFile : soundscape source, mp3 file.
 * @returns {success : true}
 */
async function addNewSoundscape(soundscapeData, coverImage, soundscapeFile) {
    try {
        let soundscapeId = await Identifier.findOne({ 'collection_id': 'soundscape_id' });
        let draftedSoundscapeObject = Object.assign(soundscapeData, { "soundscape_id": soundscapeId.value });

        let imageUrl = await moveSoundcapeImages(coverImage.path, config.get('FilePaths.draftSoundscapeCoverPic'), soundscapeId.value);
        draftedSoundscapeObject.coverImageUrl = imageUrl;

        let fileUrl = await moveSoundcapeAudios(soundscapeFile.path, config.get('FilePaths.draftSoundscapeAudio'), soundscapeId.value);

        await DraftedSoundscape.create(draftedSoundscapeObject, async (err) => {
            if (err) throw new Error(err.message);

            await Identifier.findOneAndUpdate({ 'collection_id': 'soundscape_id' }, { 'value': soundscapeId.value + 1 }, (err) => {
                if (err) throw new Error(err.message);
            });
        });
        return { "success": true }
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
}

/**
 * @description edits a drafted soundscape, moves jpg or mp3 files.
 * @param {*} soundscapeData : drafted soundscapes data.
 * @param {*} coverImage : soundscape cover image, jpg file.
 * @param {*} soundscapeFile : soundscape source, mp3 file.
 * @returns {success : true}
 */
async function editDraftedSoundscape(soundscapeData, coverImage, soundscapeFile) {
    try {
        let soundscapeId = soundscapeData.soundscape_id;
        const oldDraft = await DraftedSoundscape.findOne({ 'soundscape_id': soundscapeId }, (err, doc) => {
            if (err) throw new Error(err.message);
        });

        if (coverImage !== undefined) {
            let destPath = config.get('FilePaths.draftSoundscapeCoverPic');
            let imageUrl = await moveSoundcapeImages(coverImage.path, destPath, soundscapeId, oldDraft?.coverImageUrl);
            soundscapeData.coverImageUrl = imageUrl;
        }

        if (soundscapeFile !== undefined) {
            let mp3Path = `${config.get('FilePaths.draftSoundscapeAudio')}/${soundscapeId}.mp3`
            moveSoundcapeAudios(soundscapeFile.path, config.get('FilePaths.draftSoundscapeAudio'), soundscapeId, mp3Path);
        }

        await DraftedSoundscape.findOneAndUpdate({ "soundscape_id": soundscapeId }, soundscapeData, (err) => {
            if (err) throw new Error(err.message);
        });

        return { "success": true };
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
}

/**
 * @description edits an already published soundscapes. 
 * @param {*} soundscapeData : drafted soundscapes data.
 * @param {*} coverImage : soundscape cover image, jpg file.
 * @param {*} soundscapeFile : soundscape source, mp3 file.
 * @returns {success : true}
 */
async function editPublishedSoundscape(soundscapeData, coverImage, soundscapeFile) {
    try {
        let soundscapeId = soundscapeData.soundscape_id;
        if (coverImage !== undefined) {
            let imageUrl = await moveSoundcapeImages(coverImage.path, config.get('FilePaths.draftSoundscapeCoverPic'), soundscapeId);
            soundscapeData.coverImageUrl = imageUrl;
        }

        if (soundscapeFile !== undefined) {
            moveSoundcapeAudios(soundscapeFile.path, config.get('FilePaths.draftSoundscapeAudio'), soundscapeId);
        }

        DraftedSoundscape.updateOne({ 'soundscape_id': soundscapeId }, soundscapeData, { upsert: true }, (err) => {
            if (err) throw new Error(err.message);
        });

        return { "success": true };
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
}

/**
 * @param {*} soundscapeId : unique identifier for soundscapes.
 * @returns soundcapeObject
 */
async function publishSoundscape(soundscapeId) {
    try {
        let soundscapeObject = await DraftedSoundscape.findOne({ "soundscape_id": soundscapeId }, { _id: 0 }, (err, doc) => {
            if (err || !doc) throw new Error('File cant found');
        });

        if (soundscapeObject.coverImageUrl.includes('/drafts')) {
            let currentPath = `/srv/assets${soundscapeObject.coverImageUrl}`;
            let imageUrl = await moveSoundcapeImages(currentPath, config.get('FilePaths.soundscapeCoverPic'), soundscapeId);
            soundscapeObject.coverImageUrl = imageUrl;
        }

        let mp3Path = `${config.get('FilePaths.draftSoundscapeAudio')}/${soundscapeId}.mp3`
        if (fs.existsSync(mp3Path)) {
            let fileUrl = await moveSoundcapeAudios(mp3Path, config.get('FilePaths.soundscapeAudio'), soundscapeId);
        }

        let dataVersion = await DataVersion.findOne({ "collection_id": "soundscapes" }, { _id: 0 });
        soundscapeObject.soundscape_version = dataVersion.latest_version + 1;

        let response = await Soundscape.findOneAndUpdate({ 'soundscape_id': soundscapeId }, soundscapeObject,
            { upsert: true, new: true, setDefaultsOnInsert: true }, (err, doc) => {
                if (err) throw new Error(err.message);

                DraftedSoundscape.findOneAndDelete({ 'soundscape_id': soundscapeId }, (err) => {
                    if (err) throw new Error(err.message);

                    DataVersion.findOneAndUpdate({ "collection_id": "soundscapes", "language" : soundscapeObject.language }, { $inc: { latest_version: 1 } }, { upsert: false }, (err) => {
                        if (err) throw new Error(err.message);
                    });
                });
            });

        return response;
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
}

/**
 * @param {*} moveFrom : current image path.
 * @param {*} moveTo : destination image path.
 * @param {*} oldDraft : old image path. If exist, it deleted.
 * @returns url
 */
async function moveSoundcapeImages(moveFrom, moveTo, soundscapeId, oldDraft) {
    if (typeof oldDraft !== "undefined") {
        if (fs.existsSync(`/srv/assets${oldPath}`)) {
            fs.unlink(`/srv/assets${oldPath}`, function (err) {
                if (err) return reject(new ErrorHandler(500, err.message));
            });
        }
    }
    let imageName = `${soundscapeId}-${Math.floor(100000 + Math.random() * 900000)}.jpg`;
    let destination = path.join(moveTo, imageName);
    fs.rename(moveFrom, destination, (err) => {
        if (err) throw new Error(err.message);
    });

    return destination.split('/srv/assets')[1];
}

/**
 * @param {*} moveFrom current audio path.
 * @param {*} moveTo : destination audio path.
 * @param {*} oldDraft : old audio path. If exist, it deleted.
 * @returns url
 */
async function moveSoundcapeAudios(moveFrom, moveTo, soundscapeId, oldDraft) {
    if (typeof oldDraft !== "undefined") {
        if (!oldDraft.includes("/srv/private-assets")) {
            oldDraft = path.join('/srv/private-assets', oldDraft)
        } else {
            if (fs.existsSync(oldDraft)) {
                fs.unlink(oldDraft, function (err) {
                    if (err) return reject(new ErrorHandler(500, err.message));
                });
            }
        }
    }
    let audioName = `${soundscapeId}.mp3`;
    let destination = path.join(moveTo, audioName);
    fs.rename(moveFrom, destination, (err) => {
        if (err) throw new Error(err.message);
    });

    return destination.split('/srv/private-assets')[1];
}

/**
 * @param {*} soundscapeId : unique identifier for soundscapes.
 * @returns { success: true }
 */
async function deleteDraftedSoundscape(soundscapeId) {
    try {
        let soundscapeObject = await DraftedSoundscape.findOne({ "soundscape_id": soundscapeId });
        let coverImagePath = `/srv/assets${soundscapeObject.coverImageUrl}`;
        let mp3Path = `${config.get('FilePaths.draftSoundscapeAudio')}/${soundscapeId}.mp3`

        if (coverImagePath.includes('/drafts') && fs.existsSync(coverImagePath)) {
            fs.unlink(coverImagePath, function (err) {
                if (err) throw new Error(err.message);
            });
        }

        if (mp3Path.includes('/drafts') && fs.existsSync(mp3Path)) {
            fs.unlink(mp3Path, function (err) {
                if (err) throw new Error(err.message);
            });
        }

        await DraftedSoundscape.findOneAndDelete({ "soundscape_id": soundscapeId }, (err) => {
            if (err) throw new Error(err.message);
        });
        return { success: true }
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
}

module.exports = {
    getSoundscapes,
    getDraftedSoundscapes,
    addNewSoundscape,
    editDraftedSoundscape,
    editPublishedSoundscape,
    publishSoundscape,
    deleteDraftedSoundscape
}










