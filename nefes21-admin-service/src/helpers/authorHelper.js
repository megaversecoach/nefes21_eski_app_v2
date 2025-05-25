"use strict"

const { ErrorHandler, handleError } = require('../middleware/errorHandler');
const DraftedAuthors = require('../models/nefes21Admin/draftedAuthorsModel');
const Author = require('../models/nefes21/authorsModel');
const Identifier = require('../models/nefes21Admin/tableIdentifiersModel');
const DataVersion = require('../models/nefes21/dataVersionModel');
const searchHelper = require('./searchHelper');
const config = require('config');
const fs = require('fs');
const path = require('path');


const getAuthors = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, language: 0, __v: 0 };
        const response = (err, author) => {
            if (err) {
                return reject(new ErrorHandler(500, err.message));
            }
            resolve(author);
        }
        Author.find(query, projection, response);
    });
}

const getDraftedAuthors = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, language: 0, __v: 0 };
        const response = (err, draftAuthor) => {
            if (err) {
                return reject(new ErrorHandler(500, err.message));
            }
            resolve(draftAuthor);
        }
        DraftedAuthors.find(query, projection, response);
    });
}

async function moveAuthorImages(moveFrom, moveTo, authorId, oldPath) {
    try {
        if (oldPath !== undefined) {
            if (fs.existsSync(`/srv/assets${oldPath}`)) {
                fs.unlink(`/srv/assets${oldPath}`, function (err) {
                    if (err) return reject(new ErrorHandler(500, err.message));
                });
            }
        }

        let imageName = `${authorId}-${Math.floor(100000 + Math.random() * 900000)}.jpg`;
        let destination = path.join(moveTo, imageName);
        fs.rename(moveFrom, destination, function (err) {
            if (err) return reject(new ErrorHandler(500, err.message));
        });

        return destination.split('/srv/assets')[1];

    } catch (error) {
        throw new ErrorHandler(400, error.message);
    }
}

function addNewDraftedAuthor(authorData, profilePic, headerImage) {
    return new Promise(async (resolve, reject) => {
        let authorId = await Identifier.findOne({ 'collection_id': 'author_id' });
        authorData = Object.assign(authorData, { "author_id": authorId.value });

        authorData.profilePicUrl = await moveAuthorImages(profilePic.path, config.get('FilePaths.draftAuthorProfilePic'), authorId.value)
            .catch((error) => {
                return reject(new ErrorHandler(500, error.message));
            });


        authorData.headerImageUrl = await moveAuthorImages(headerImage.path, config.get('FilePaths.draftAuthorHeaderPic'), authorId.value)
            .catch((error) => {
                return reject(new ErrorHandler(500, error.message));
            });

        await DraftedAuthors.create(authorData, async (err) => {
            if (err) return reject(new ErrorHandler(500, err.message));

            await Identifier.findOneAndUpdate({ 'collection_id': 'author_id' }, { 'value': authorId.value + 1 }, function (err) {
                if (err) return reject(new ErrorHandler(500, err.message));
            });
        });

        resolve({ "success": true });
    });
}

function editDraftedAuthor(authorData, profilePic, headerImage) {
    return new Promise(async (resolve, reject) => {
        let authorId = authorData.author_id;
        const oldDraft = await DraftedAuthors.findOne({ 'author_id': authorId }, (err) => {
            if (err) return reject(new ErrorHandler(500, err.message));
        });

        if (profilePic !== undefined) {
            let profileDest = config.get('FilePaths.draftAuthorProfilePic')
            authorData.profilePicUrl = await moveAuthorImages(profilePic.path, profileDest, authorId, oldDraft.profilePicUrl)
                .catch((error) => {
                    return reject(new ErrorHandler(500, error.message));
                });
        }

        if (headerImage !== undefined) {
            let headerDest = config.get('FilePaths.draftAuthorHeaderPic')
            authorData.headerImageUrl = await moveAuthorImages(headerImage.path, headerDest, authorId, oldDraft.headerImageUrl)
                .catch((error) => {
                    return reject(new ErrorHandler(500, error.message));
                });
        }

        await DraftedAuthors.findOneAndUpdate({ 'author_id': authorId }, authorData, (err, doc) => {
            if (err) return reject(new ErrorHandler(500, err.message));
        });

        resolve({ "success": true });
    });
}

function editPublishAuthor(authorData, profilePic, headerImage) {
    return new Promise(async (resolve, reject) => {
        let authorId = authorData.author_id;

        if (profilePic) {
            authorData.profilePicUrl = await moveAuthorImages(profilePic.path, config.get('FilePaths.draftAuthorProfilePic'), authorId)
                .catch((error) => {
                    return reject(new ErrorHandler(500, error.message));
                });
        }

        if (headerImage) {
            authorData.headerImageUrl = await moveAuthorImages(headerImage.path, config.get('FilePaths.draftAuthorHeaderPic'), authorId)
                .catch((error) => {
                    return reject(new ErrorHandler(500, error.message));
                });
        }

        DraftedAuthors.updateOne({ 'author_id': authorId }, authorData, { upsert: true }, (err) => {
            if (err) return reject(new ErrorHandler(500, err.mess));
        });

        resolve({ "success": true });
    });
}

function publishAuthor(authorId) {
    return new Promise(async (resolve, reject) => {
        try {
            let authorData = await DraftedAuthors.findOne({ "author_id": authorId }, { _id: 0 });
            if(!authorData) return reject(new ErrorHandler(500, 'Author Not Found'));

            if (authorData.profilePicUrl.includes('/drafts')) {
                let currentProfile = `/srv/assets/${authorData.profilePicUrl}`;
                authorData.profilePicUrl = await moveAuthorImages(currentProfile, config.get('FilePaths.authorProfilePic'), authorId);
            }

            if (authorData.headerImageUrl.includes('/drafts')) {
                let currentHeader = `/srv/assets/${authorData.headerImageUrl}`;
                authorData.headerImageUrl = await moveAuthorImages(currentHeader, config.get('FilePaths.authorHeaderPic'), authorId);
            }

            let newAuthorObject = toAuthorModel(authorData);

            await Author.findOneAndUpdate({ 'author_id': authorId }, newAuthorObject, { upsert: true, new: true, setDefaultsOnInsert: true });
    
            await DraftedAuthors.findOneAndDelete({ 'author_id': authorId });
    
            await DataVersion.findOneAndUpdate({ "collection_id": "authors", "language": authorData.language }, { $inc: { latest_version: 1 } });
                   
            searchHelper.updateSearchFile();
            
            resolve(newAuthorObject);
        }catch(error){
            return reject(new ErrorHandler(500, error.message));
        }      
    });
}

async function deleteDraftedAuthor(authorId) {
    try {
        let authorObject = await DraftedAuthors.findOne({ 'author_id': authorId });
        let profilePicPath = `/srv/assets${authorObject.profilePicUrl}`;
        let headerPicPath = `/srv/assets${authorObject.headerImageUrl}`;

        if (profilePicPath.includes('/drafts') && fs.existsSync(profilePicPath)) {
            fs.unlink(profilePicPath, function (err) {
                if (err) throw new Error(err.message);
            });
        }

        if (headerPicPath.includes('/drafts') && fs.existsSync(headerPicPath)) {
            fs.unlink(headerPicPath, function (err) {
                if (err) throw new Error(err.message);
            });
        }

        await DraftedAuthors.findOneAndDelete({ "author_id": authorId }, (err, doc) => {
            if (err) throw new Error(err.message);
        });

        return { success: true }
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
}

function toAuthorModel(draftedAuthor){
    try {
        let newAuthorObject = {
            author_id : draftedAuthor.author_id,
            author_label : draftedAuthor.author_label,
            author_name : draftedAuthor.author_name,
            author_surname : draftedAuthor.author_surname,
            author_title : draftedAuthor.author_title,
            author_info : draftedAuthor.author_info,
            author_position : draftedAuthor.author_position,
            profilePicUrl : draftedAuthor.profilePicUrl,
            headerImageUrl : draftedAuthor.headerImageUrl,
            isConsulting : draftedAuthor.isConsulting,
            language : draftedAuthor.language
        }

        return newAuthorObject;
    } catch (error) {
        throw new Error(error);
    }
}


module.exports = {
    getAuthors,
    getDraftedAuthors,
    addNewDraftedAuthor,
    editDraftedAuthor,
    editPublishAuthor,
    publishAuthor,
    deleteDraftedAuthor
}