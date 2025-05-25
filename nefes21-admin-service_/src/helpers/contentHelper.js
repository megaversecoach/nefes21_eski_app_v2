"use strict";

const { ErrorHandler, handleError } = require('../middleware/errorHandler');
const ContentType = require('../models/nefes21/contentTypeModel');
const DraftedContent = require('../models/nefes21Admin/draftedContent');
const Content = require('../models/nefes21/contentModel');
const DraftedTrack = require('../models/nefes21Admin/draftedTrackModel');
const Track = require('../models/nefes21/trackModel');
const Identifier = require('../models/nefes21Admin/tableIdentifiersModel');
const DataVersion = require('../models/nefes21/dataVersionModel');
const path = require('path');
const config = require('config');
const fs = require('fs');
const searchHelper = require('./searchHelper');

const getContentType = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, language: 0 };
        const response = (err, contentType) => {
            if (err) reject(new ErrorHandler(500, err.message));
            resolve(contentType);
        }
        ContentType.find(query, projection, response);
    });
}

const getContents = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, language: 0 };
        const response = (err, contents) => {
            if (err) return reject(new ErrorHandler(500, err.message));
            resolve(contents);
        }
        Content.find(query, projection, response);
    });
}

const getDraftedContents = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, language: 0 };
        const response = (err, drafts) => {
            if (err) return reject(new ErrorHandler(500, err.message));
            resolve(drafts);
        }
        DraftedContent.find(query, projection, response);
    });
}

const getDraftedContentsById = (contentId) => {
    return new Promise((resolve, reject) => {
        const query = { "content_id": contentId };
        const projection = { _id: 0, language: 0 };
        const response = (err, drafts) => {
            if (err) return reject(new ErrorHandler(500, err.message));
            resolve(drafts);
        }
        DraftedContent.findOne(query, projection, response);
    });
}

async function moveContentImages(moveFrom, moveTo, contentId, oldPath) {
    try {
        if (oldPath !== undefined) {
            if (fs.existsSync(`/srv/assets${oldPath}`)) {
                fs.unlink(`/srv/assets${oldPath}`, (err) => {
                    if (err) throw new Error(err.message);
                });
            }
        }

        let imageName = `${contentId}-${Math.floor(100000 + Math.random() * 900000)}.jpg`;
        let current = moveFrom;
        let destination = path.join(moveTo, imageName);
        fs.rename(current, destination, (err) => {
            if (err) throw new Error(err.message);
        });

        return destination.split('/srv/assets')[1];
    } catch (error) {
        throw new ErrorHandler(400, 'Something went wrong');
    }
}

function addNewDraftContent(contentData, coverPic, showcasePic) {
    return new Promise(async (resolve, reject) => {
        let contentId = await Identifier.findOne({ 'collection_id': 'content_id' });
        let draftedContentObject = Object.assign(contentData, { "content_id": contentId.value, "dateCreated": Date.now() });

        if (coverPic === undefined || showcasePic === undefined) return reject(new ErrorHandler(500, 'Something went wrong'));

        draftedContentObject.coverImageUrl = await moveContentImages(coverPic.path, config.get('FilePaths.draftContentCover'), contentId.value)
            .catch((error) => {
                return reject(new ErrorHandler(500, error.message));
            });

        draftedContentObject.showcaseImageUrl = await moveContentImages(showcasePic.path, config.get('FilePaths.draftContentShowcase'), contentId.value)
            .catch((error) => {
                return reject(new ErrorHandler(500, error.message));
            });

        DraftedContent.create(draftedContentObject, (err) => {
            if (err) return reject(new ErrorHandler(500, err.message));

            Identifier.findOneAndUpdate({ 'collection_id': 'content_id' }, { 'value': contentId.value + 1 }, (err) => {
                if (err) return reject(new ErrorHandler(500, err.message));

                resolve({ success: true });
            });
        });
    });
}

function editDraftedContent(contentData, coverPic, showcasePic) {
    return new Promise(async (resolve, reject) => {
        let contentId = contentData.content_id;
        const oldDraft = await DraftedContent.findOne({ 'content_id': contentId }, (err) => {
            if (err) return reject(new ErrorHandler(500, 'DATA_CANT_FOUND'));
        });

        if (coverPic !== undefined) {
            let coverDest = config.get('FilePaths.draftContentCover')
            contentData.coverImageUrl = await moveContentImages(coverPic.path, coverDest, contentId, oldDraft.coverImageUrl)
                .catch((error) => {
                    return reject(new ErrorHandler(500, error.message));
                });
        }

        if (showcasePic !== undefined) {
            let showcaseDest = config.get('FilePaths.draftContentShowcase');
            contentData.showcaseImageUrl = await moveContentImages(showcasePic.path, showcaseDest, contentId, oldDraft.showcaseImageUrl)
                .catch((error) => {
                    return reject(new ErrorHandler(500, error.message));
                });
        }

        await DraftedContent.findOneAndUpdate({ "content_id": contentId }, contentData, (err) => {
            if (err) return reject(new ErrorHandler(500, err.message));

            resolve({ "success": true });
        });
    });
}

function editPublishedContent(contentData, coverPic, showcasePic) {
    return new Promise(async (resolve, reject) => {
        let contentId = contentData.content_id;
        if (coverPic !== undefined) {
            contentData.coverImageUrl = await moveContentImages(coverPic.path, config.get('FilePaths.draftContentCover'), contentId)
                .catch((error) => {
                    return reject(new ErrorHandler(500, error.message));
                });
        }

        if (showcasePic !== undefined) {
            contentData.showcaseImageUrl = await moveContentImages(showcasePic.path, config.get('FilePaths.draftContentShowcase'), contentId)
                .catch((error) => {
                    return reject(new ErrorHandler(500, error.message));
                });
        }

        DraftedContent.updateOne({ 'content_id': contentId }, contentData, { upsert: true }, (err) => {
            if (err) return reject(new ErrorHandler(500, err.message));

            resolve({ "success": true });
        });
    });
}

function publishContent(contentId) {
    return new Promise(async (resolve, reject) => {
        try {
            let isContentChange;
            let currentVersion = await DataVersion.findOne({ "collection_id": "contents" });
            let publisedContent = await Content.findOne({ "content_id": contentId }, { _id: 0 });

            let draftedContentObject = await DraftedContent.findOne({ 'content_id': contentId }, {_id : 0}, (err, doc) => {
                if (err || !doc) return reject(new ErrorHandler(500, 'Someting went wrong'));
            });

            if (draftedContentObject?.coverImageUrl.includes('/drafts')) {
                let draftedContentCoverPath = `/srv/assets/${draftedContentObject.coverImageUrl}`;
                draftedContentObject.coverImageUrl = await moveContentImages(draftedContentCoverPath, config.get('FilePaths.contentCover'), contentId);
            }

            if (draftedContentObject?.showcaseImageUrl.includes('/drafts')) {
                let draftedContentShowcasePath = `/srv/assets/${draftedContentObject.showcaseImageUrl}`;
                draftedContentObject.showcaseImageUrl = await moveContentImages(draftedContentShowcasePath, config.get('FilePaths.contentShowcase'), contentId);
            }

            if (publisedContent === null) {
                draftedContentObject.content_version = 1;
            } else {
                isContentChange = await compareContentObjects(draftedContentObject, publisedContent);
                if (isContentChange === true) draftedContentObject.content_version = currentVersion.latest_version + 1;
            }

            let draftedContentTracks = await DraftedTrack.find({ 'content_id': contentId }, { _id: 0 });

            await updateTracksVersions(publisedContent, contentId, draftedContentTracks);

            await moveTracksToPublish(draftedContentTracks);

            let newContentObject = toContentModel(draftedContentObject);

            Content.findOneAndUpdate({'content_id' : contentId}, newContentObject, {upsert : true}, (err, doc) => {
                if(err) return reject(new ErrorHandler(500, 'Someting went wrong'));
            });

            await DraftedContent.findOneAndDelete({ "content_id": contentId });

            if (isContentChange === true) {
                await DataVersion.findOneAndUpdate({ "collection_id": "contents", "language": newContentObject.language }, { $inc: { "latest_version": 1 } });
            }
            searchHelper.updateSearchFile()

            resolve(newContentObject);
        } catch (error) {
            return reject(new ErrorHandler(500, error.message));
        }
    });
}

function toContentModel(draftedContent){
    try {
        const newContentObject = {
            content_isFree : draftedContent.content_isFree,
            content_id : draftedContent.content_id,
            content_title : draftedContent.content_title,
            content_description : draftedContent.content_description,
            content_type_id : draftedContent.content_type_id,
            isMultiTrack : draftedContent.isMultiTrack,
            content_duration : draftedContent.content_duration,
            author_id : draftedContent.author_id,
            coverImageUrl : draftedContent.coverImageUrl,
            showcaseImageUrl : draftedContent.showcaseImageUrl,
            content_isNew : draftedContent.content_isNew,
            ageSegment : draftedContent.ageSegment,
            genderSegment : draftedContent.genderSegment,
            dateCreated : draftedContent.dateCreated,
            datePublished : Date.now(),
            content_isValid : draftedContent.content_isValid,
            content_version : draftedContent.content_version,
            language : draftedContent.language
        }
        return newContentObject;
    } catch (error) {
        throw new Error(error);
    }
}

async function moveTracksToPublish(draftedContentTracks) {
    try {
        draftedContentTracks.forEach(async (item) => {
            let sourceUrl = `${config.get('FilePaths.drafTracks')}/${item.track_id}.mp3`;
            if (fs.existsSync(sourceUrl)) {
                let fileName = item.track_id + '.mp3'
                let destination = path.join(config.get('FilePaths.tracks'), fileName);
                let deletedSource = await fs.rename(sourceUrl, destination, (err) => {
                    if (err) return new ErrorHandler(500, err.message);
                });
            }

            const newTrackObject = {
                content_id : item.content_id,
                language : item.language,
                narrator_id : item.narrator_id,
                orderInContent : item.orderInContent,
                soundscape_id : item.soundscape_id,
                soundscape_volume : item.soundscape_volume,
                source_id : item.source_id,
                track_duration : item.track_duration,
                track_id : item.track_id,
                track_isFree : item.track_isFree,
                track_isValid : item.track_isValid,
                track_label : item.track_label,
                track_title : item.track_title,
                track_version : item.track_version
            }

            await Track.findOneAndUpdate({ 'track_id': item.track_id }, newTrackObject,
                { upsert: true });
                
            await DraftedTrack.findOneAndDelete({ "track_id": item.track_id });   
        });
    } catch (error) {
        return new ErrorHandler(500, error.message);
    }
}

async function compareContentObjects(contentObject, publisedContent) {
    try {
        let contentData = contentObject;
        delete contentData.content_version
        delete contentData.__v;
        for (let key of Object.keys(contentData._doc)) {
            if (contentData[key] !== publisedContent[key]) return true;
        }
        return false;
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
}

async function updateTracksVersions(publisedContent, content_id, draftedContentTracks) {
    try {
        let trackLanguage = draftedContentTracks[0].language;
        let changedTracks = new Set();

        let publishedTracks = await Track.find({ "content_id": content_id }, { _id: 0 });

        for (let track of draftedContentTracks) {
            let item = publishedTracks.find((publishedTrack) => publishedTrack.track_id === track.track_id);

            if (publisedContent === null) track.track_version = 1;
            else if (typeof item === "undefined") changedTracks.add(track.track_id);
            else {
                delete track._id;
                delete track.track_version;
                delete track.__v;
                for (let key of Object.keys(track._doc)) {
                    if (item !== undefined && (track[key] !== item[key])) {
                        changedTracks.add(track.track_id);
                    }
                }
            }
        }

        if (changedTracks.size > 0) {
            let currentTrackVersion = await DataVersion.findOne({ "collection_id": "tracks", "language": trackLanguage });

            for (let track of draftedContentTracks) {
                if (changedTracks.has(track.track_id)) track.track_version = currentTrackVersion.latest_version + 1;
            }

            DataVersion.findOneAndUpdate({ "collection_id": "tracks" }, { $inc: { "latest_version": 1 } }, (err) => {
                if (err) return new ErrorHandler(500, err.message);
            });
        }
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
}

async function deleteDraftedContent(contentId) {
    return new Promise(async (resolve, reject) => {
        let contentObject = await DraftedContent.findOne({ 'content_id': contentId }, (err) => {
            if (err) return reject(new ErrorHandler(500, 'Something went wrong'));
        });

        let coverPicPath = `/srv/assets${contentObject.coverImageUrl}`;
        if (coverPicPath.includes('/drafts') && fs.existsSync(coverPicPath)) {
            fs.unlink(coverPicPath, function (err) {
                if (err) return reject(new ErrorHandler(500, err.message));
            });
        }

        let showcasePicPath = `/srv/assets${contentObject.showcaseImageUrl}`;
        if (showcasePicPath.includes('/drafts') && fs.existsSync(showcasePicPath)) {
            fs.unlink(showcasePicPath, function (err) {
                if (err) return reject(new ErrorHandler(500, err.message));
            });
        }

        let tracksOfContent = await DraftedTrack.find({ "content_id": contentId }, (err) => {
            if (err) return reject(new ErrorHandler(500, err.message));
        });

        for (let item of tracksOfContent) {
            let sourcePath = `${config.get('FilePaths.drafTracks')}/${item.track_id}.mp3`;
            if (sourcePath.includes('/drafts') && fs.existsSync(sourcePath)) {
                fs.unlink(sourcePath, function (err) {
                    if (err) return reject(new ErrorHandler(500, err.message));
                });
            }
        }

        const deletedTracks = await DraftedTrack.deleteMany({ "content_id": contentId }, async (err) => {
            if (err) return reject(new ErrorHandler(500, err.message));

            await DraftedContent.findOneAndDelete({ "content_id": contentId }, (err) => {
                if (err) return reject(new ErrorHandler(500, err.message));
            });

            resolve({ "success": true });
        });
    });
}



module.exports = {
    getContentType,
    getContents,
    getDraftedContents,
    addNewDraftContent,
    editDraftedContent,
    editPublishedContent,
    deleteDraftedContent,
    publishContent,
    getDraftedContentsById
}