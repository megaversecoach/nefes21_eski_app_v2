"use strict";

const Narrator = require('../models/nefes21/narratorsModel');
const DraftedNarrator = require('../models/nefes21Admin/draftedNarratorsModel');
const Identifier = require('../models/nefes21Admin/tableIdentifiersModel');
const DataVersion = require('../models/nefes21/dataVersionModel');
const path = require('path');
const config = require('config');
const fs = require('fs');
const {ErrorHandler, handleError} = require('../middleware/errorHandler');

const getNarrators = (lang) => {
    return new Promise((resolve, reject) => {
        const query = {"language": lang};
        const projection = {_id: 0, language: 0};
        const response = (err, narrators) => {
            if (err) return reject(new ErrorHandler(500, err.message));
            resolve(narrators);
        }
        Narrator.find(query, projection, response);
    });
}

const getDraftedNarrators = (lang) => {
    return new Promise((resolve, reject) => {
        const query = {"language": lang};
        const projection = {_id: 0, language: 0};
        const response = (err, drafts) => {
            if (err) return reject(new ErrorHandler(500, err.message));
            resolve(drafts);
        }
        DraftedNarrator.find(query, projection, response);
    });
}

function addNewDraftedNarrator(narratorData, profilePicture) {
    return new Promise(async (resolve, reject) => {
        let draftedNarratorObject;
        let narratorId = await Identifier.findOne({'collection_id': 'narrator_id'});
        draftedNarratorObject = Object.assign(narratorData, {"narrator_id": narratorId.value});

        let profileImageName = `${narratorId.value}-${Math.floor(100000 + Math.random() * 900000)}.jpg`;
        let currentPath = profilePicture.path;
        let destination = path.join(config.get('FilePaths.draftNarratorProfilePic'), profileImageName);
        fs.rename(currentPath, destination, (err) => {
            if (err) return reject(new ErrorHandler(500, 'FILE_ERROR'));
        });

        draftedNarratorObject.profilePicUrl = destination.split('/srv/assets')[1];

        await DraftedNarrator.create(draftedNarratorObject, function (err) {
            if (err) return reject(new ErrorHandler(500, err.message));
        });

        await Identifier.findOneAndUpdate({'collection_id': 'narrator_id'}, {'value': narratorId.value + 1}, (err) => {
            if (err) return reject(new ErrorHandler(500, err.message));
        });

        resolve({success: true});
    });
}

function editDraftedNarrator(narratorData, profilePicture) {
    return new Promise(async (resolve, reject) => {
        let narratorId = narratorData.narrator_id;
        const oldDraft = await DraftedNarrator.findOne({'narrator_id': narratorId}, (err) => {
            if (err) return reject(new ErrorHandler(500, 'DATA_CANT_FOUND'));
        });

        if (profilePicture !== undefined) {
            if (fs.existsSync(`/srv/assets${oldDraft.profilePicUrl}`)) {
                fs.unlink(`/srv/assets${oldDraft.profilePicUrl}`, (err) => {
                    if (err) return reject(new ErrorHandler(500, err.message));
                });
            }

            let profileImageName = `${narratorId}-${Math.floor(100000 + Math.random() * 900000)}.jpg`;
            let currentPath = profilePicture.path;
            let destination = path.join(config.get('FilePaths.draftNarratorProfilePic'), profileImageName);
            fs.rename(currentPath, destination, function (err) {
                if (err) return reject(new ErrorHandler(500, 'FILE_ERROR'));
            });

            narratorData.profilePicUrl = destination.split('/srv/assets')[1];
        }

        await DraftedNarrator.findOneAndUpdate({"narrator_id": narratorId}, narratorData, (err) => {
            if (err) return reject(new ErrorHandler(500, err.message));
        });
        resolve({"success": true});
    });
}

function editPublishedNarrator(narratorData, profilePicture) {
    return new Promise((resolve, reject) => {
        let narratorId = narratorData.narrator_id;
        if (profilePicture !== undefined) {
            let profileImageName = `${narratorId}-${Math.floor(100000 + Math.random() * 900000)}.jpg`;
            let currentPath = profilePicture.path;
            let destination = path.join(config.get('FilePaths.draftNarratorProfilePic'), profileImageName);
            fs.rename(currentPath, destination, (err) => {
                if (err) return reject(new ErrorHandler(500, 'FILE_ERROR'));
            });

            narratorData.profilePicUrl = destination.split('/srv/assets')[1];
        }

        DraftedNarrator.updateOne({'narrator_id': narratorId}, narratorData, {upsert: true}, (err) => {
            if (err) return reject(new ErrorHandler(500, 'FILE_ERROR'));
        });
        resolve({"success": true});
    });
}

function publishNarrator(narratorId) {
    return new Promise(async (resolve, reject) => {
        try {
            let narratorObject = await DraftedNarrator.findOne({'narrator_id': narratorId},{_id : 0});
            if(!narratorObject) return reject(new Error(500, 'Narrator not found'));

            if(narratorObject.profilePicUrl.includes('/drafts')){
                let profileImageName = `${narratorId}-${Math.floor(100000 + Math.random() * 900000)}.jpg`;
                let currentPath = `/srv/assets/${narratorObject.profilePicUrl}`;
                let destination = path.join(config.get('FilePaths.narratorProfilePic'), profileImageName);
                fs.rename(currentPath, destination, function (err) {
                    if (err) return reject(new ErrorHandler(500, 'FILE_ERROR'));
                });
        
                narratorObject.profilePicUrl = destination.split('/srv/assets')[1];
            }

            const newNarratorObject = toNarratorModel(narratorObject);

            await Narrator.findOneAndUpdate({'narrator_id': narratorId}, narratorObject, {upsert: true, new : true, setDefaultsOnInsert : true});

            await DraftedNarrator.findOneAndDelete({'narrator_id': narratorId});
            
            await DataVersion.findOneAndUpdate({ "collection_id": "narrators", "language" : narratorObject.language }, { $inc: { latest_version: 1 }});

            resolve(newNarratorObject);
            
        } catch (error) {
            return reject(new ErrorHandler(500, error.message));
        }
    });
}

async function deleteDraftedNarrator(narratorId){
    try{
        let narratorObject = await DraftedNarrator.findOne({"narrator_id" : narratorId});
        let profilePicPath = `/srv/assets${narratorObject.profilePicUrl}`;

        if (profilePicPath.includes('/drafts') && fs.existsSync(profilePicPath)) {
            fs.unlink(profilePicPath, function (err) {
                if (err) throw new Error(err.message);
            });
        }

        await DraftedNarrator.findOneAndDelete({"narrator_id" : narratorId}, (err) => {
            if(err) throw new Error(err.message);
        });

        return {success : true}
    }catch (error){
        throw  new ErrorHandler(500,error.message);
    }
}

function toNarratorModel(draftedNarrator){
    try {
        let newNarratorObject = {
            narrator_id : draftedNarrator.narrator_id,
            narrator_name : draftedNarrator.narrator_name,
            narrator_surname : draftedNarrator.narrator_surname,
            narrator_title : draftedNarrator.narrator_title,
            narrator_info : draftedNarrator.narrator_info,
            profilePicUrl : draftedNarrator.profilePicUrl,
            language : draftedNarrator.language
        }

        return newNarratorObject;
    } catch (error) {
        throw new Error(error);
    }
}


module.exports = {
    getNarrators,
    getDraftedNarrators,
    addNewDraftedNarrator,
    editDraftedNarrator,
    editPublishedNarrator,
    publishNarrator,
    deleteDraftedNarrator
}
