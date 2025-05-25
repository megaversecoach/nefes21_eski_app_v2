"use strict";

const Card = require('../models/nefes21/cardsModel');
const Deck = require('../models/nefes21/decksModel');
const Identifier = require('../models/nefes21Admin/tableIdentifiersModel');
const DataVersion = require('../models/nefes21/dataVersionModel');
const fs = require('fs');
const path = require('path');
const config = require('config');
const { ErrorHandler, handleError } = require('../middleware/errorHandler');

const getCards = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, __v: 0 };
        const response = (err, cards) => {
            if (err) reject(new ErrorHandler(500, err.message));
            resolve(cards);
        }
        Card.find(query, projection, response);
    });
}

const getDecks = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, language: 0, __v: 0 };
        const response = (err, decks) => {
            if (err) reject(new ErrorHandler(500, err.message));
            resolve(decks);
        }
        Deck.find(query, projection, response);
    });
}

function publishDecks(deckData, images) {
    return new Promise(async (resolve, reject) => {
        if (deckData.deck_id === undefined) {
            let deckIdentifier = await Identifier.findOne({ 'collection_id': 'deck_id' });
            deckData = Object.assign(deckData, { 'deck_id': deckIdentifier.value });

            Identifier.findOneAndUpdate({ 'collection_id': 'deck_id' }, { 'value': deckIdentifier.value + 1 }, (err) => {
                if (err) return reject(new ErrorHandler(500, err.message));
            });
        }

        let oldDeck = await Deck.findOne({ "deck_id": deckData.deck_id }, (err) => {
            if (err) return resolve(new ErrorHandler(err.message));
        });

        if (oldDeck !== null) {
            if (oldDeck.deck_isValid !== deckData.deck_isValid) {
                if (oldDeck.deck_isValid === 'true') {
                    await Card.updateMany({ "deck_id": deckData.deck_id, "isDailyAvailable": 'true' }, { $set: { "isDailyAvailable": 'invalid' } }, (err) => {
                        if (err) return resolve(new ErrorHandler(err.message));
                    });
                }
                await Card.updateMany({ "deck_id": deckData.deck_id, "isDailyAvailable": 'invalid' }, { $set: { "isDailyAvailable": 'true' } }, (err) => {
                    if (err) return resolve(new ErrorHandler(err.message));
                });
            }
        }

        if (images['showcase-image']) {
            let showcaseDest = await moveImagesToPublish(images['showcase-image'][0], deckData.deck_id, oldDeck?.showcaseImageUr);
            deckData.showcaseImageUrl = showcaseDest;
        }
        if (images['front-image']) {
            let frontDest = await moveImagesToPublish(images['front-image'][0], deckData.deck_id, oldDeck?.cardFrontImageUrl);
            deckData.cardFrontImageUrl = frontDest;
        }
        if (images['back-image']) {
            let backDest = await moveImagesToPublish(images['back-image'][0], deckData.deck_id, oldDeck?.cardBackImageUrl);
            deckData.cardBackImageUrl = backDest;
        }
        if (images['background-image']) {
            let backgroundDest = await moveImagesToPublish(images['background-image'][0], deckData.deck_id, oldDeck?.backgroundImageUrl);
            deckData.backgroundImageUrl = backgroundDest;
        }

        Deck.updateOne({ 'deck_id': deckData.deck_id }, deckData, { upsert: true, setDefaultOnInsert: true }, (err) => {
            if (err) return reject(new ErrorHandler(400, err.message));

            DataVersion.findOneAndUpdate({ "collection_id": "decks", "language" : deckData.language}, { $inc: { latest_version: 1 } }, (err) => {
                if (err) return reject(new ErrorHandler(500, err.message));
            });
        });

        resolve({ success: true });
    });
}

function publishCards(cards, deck_id, lang) {
    return new Promise(async (resolve, reject) => {
        let deletedCards = await Card.deleteMany({ "deck_id": deck_id, "language": lang }, (err) => {
            if (err) return reject(new ErrorHandler(500, err.message));

            Card.insertMany(cards, (err) => {
                if (err) return reject(new ErrorHandler(500, err.message));

                DataVersion.findOneAndUpdate({ "collection_id": "cards", "language" : lang }, { $inc: { latest_version: 1 } }, (err) => {
                    if (err) return reject(new ErrorHandler(500, err.message));
                    
                    resolve({ success: true });
                });
            });
        });
    });
}

async function moveImagesToPublish(file, deck_id, oldPath) {
    try {
        if(oldPath !== undefined){
            if (fs.existsSync(`/srv/assets${oldPath}`)) {
                fs.unlink(`/srv/assets${oldPath}`, function (err) {
                    if (err) throw new ErrorHandler(500, 'FILE_ERROR');
                });
            }
        }
        let imageName = `${deck_id}-${Math.floor(100000 + Math.random() * 900000)}.jpg`;
        let currentPath = file.path;
        let destination = path.join(`/srv/assets/images/cards`, imageName);
        fs.rename(currentPath, destination, function (err) {
            if (err) throw new ErrorHandler(500, 'FILE_ERROR');
        });

        return destination.split('/srv/assets')[1];
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
}

module.exports = {
    getCards,
    getDecks,
    publishDecks,
    publishCards
}