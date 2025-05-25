"use strict";

const { ErrorHandler, handleError } = require('../middleware/errorHandler');
const ContentPoolStarter = require('../models/nefes21/contentPoolStartersModel');
const ContentPoolSeries = require('../models/nefes21/contentPoolSeriesModel');
const ContentPoolShowcases = require('../models/nefes21/contentPoolShowcasesModel');
const NonPersonalizedItem = require('../models/nefes21/nonPersonalizedItemsModel');
const Identifier = require('../models/nefes21Admin/tableIdentifiersModel');
const DataVersion = require('../models/nefes21/dataVersionModel');
const config = require('config');
const path = require('path');
const fs = require('fs');

const getStarters = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang }
        const projection = { _id: 0, __v: 0 }
        const response = (err, starters) => {
            if (err) {
                reject(new Error(`Something went wrong ${err}`));
            }
            resolve(starters);
        }
        ContentPoolStarter.find(query, projection, response);
    });
}

function publishStarters(starters, lang) {
    return new Promise(async (resolve, reject) => {
        let deletedStarters = await ContentPoolStarter.deleteMany({ "language": lang }, (err) => {
            if (err) return reject(new ErrorHandler(500, err.message));

            ContentPoolStarter.insertMany(starters, (err) => {
                if (err) return reject(new ErrorHandler(500, err.message));

                DataVersion.findOneAndUpdate({ "collection_id": "today_starters", "language" : lang}, { $inc: { latest_version: 1 }}, (err) => {
                    if (err) return reject(new ErrorHandler(500, err.message));

                    resolve({ success: true });
                });
            });
        });
    });
}

const getSeries = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, __v: 0 };
        const response = (err, series) => {
            if (err) {
                reject(new Error(`Something went wrong ${err}`));
            }
            resolve(series);
        }
        ContentPoolSeries.find(query, projection, response);
    });
}

function publishSeries(series, lang, dimension_id) {
    return new Promise(async (resolve, reject) => {
        let deletedSeries = await ContentPoolSeries.deleteMany({ "language": lang, "dimension_id": dimension_id }, (err) => {
            if (err) return reject(new ErrorHandler(500, err.message));

            ContentPoolSeries.insertMany(series, (err) => {
                if (err) return reject(new ErrorHandler(500, err.message));
                
                DataVersion.findOneAndUpdate({ "collection_id": "today_series", "language" : lang}, { $inc: { latest_version: 1 }}, (err) => {
                    if (err) return reject(new ErrorHandler(500, err.message));

                    resolve({ success: true });
                });
            });
        });
    });
}

const getPersonalizedShowcases = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, __v: 0 };
        const response = (err, showcases) => {
            if (err) {
                reject(new Error(`Something went wrong ${err}`));
            }
            resolve(showcases);
        }
        ContentPoolShowcases.find(query, projection, response);
    });
}

function publishPersonalizedShowcases(showcases, lang, dimension_id) {
    return new Promise(async (resolve, reject) => {
        let deletedShowcases = await ContentPoolShowcases.deleteMany({ "language": lang, "dimension_id": dimension_id }, (err) => {
            if (err) return reject(new ErrorHandler(500, err.message));

            ContentPoolShowcases.insertMany(showcases, (err) => {
                if (err) return reject(new ErrorHandler(500, err.message));

                DataVersion.findOneAndUpdate({"collection_id" : "today_contentpool_showcases", "language" : lang }, { $inc: { latest_version: 1 }}, (err) => {
                    if (err) return reject(new ErrorHandler(500, err.message));

                    resolve({ success: true });
                });
            });
        });
    });
}

const getNonPersonalizedShowcases = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, __v: 0};
        const response = (err, showcases) => {
            if (err) {
                reject(new Error(`Something went wrong ${err}`));
            }
            resolve(showcases);
        }
        NonPersonalizedItem.find(query, projection, response);
    });
}

async function publishNonPersonalizedShowceses(showcaseObject, image) {
    try {
        if (showcaseObject.showcase_id == '') {
            let showcaseIdentifier = await Identifier.findOne({ "collection_id": "showcase_id" });
            let showcaseId = showcaseIdentifier.value;
            showcaseObject = Object.assign(showcaseObject, { "showcase_id": showcaseId });
            Identifier.findOneAndUpdate({ "collection_id": "showcase_id" }, {"value": showcaseId + 1 }, (err) => {
                if (err) throw new ErrorHandler(500, err.message);
            });
        }

        if (image) {
            let newPath = await renameFile(image, showcaseObject.showcase_id, showcaseObject.showcase_imageUrl);
            showcaseObject.showcase_imageUrl = newPath;
        }

        let response = await NonPersonalizedItem.findOneAndUpdate({ 'showcase_id': showcaseObject.showcase_id }, showcaseObject,
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }, (err) => {
                if (err) throw new ErrorHandler(500, err.message);

                DataVersion.findOneAndUpdate({"collection_id" : "today_nonpersonalized_showcases", "language" : showcaseObject.language }, { $inc: { latest_version: 1 }}, (err) => {
                    if (err) return reject(new ErrorHandler(500, err.message));
                });
            });
        return {success : true}  
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
}

function deleteNonPersonalizedShowcase(showcaseId){
    return new Promise(async(resolve, reject) => {
        const showcaseObject = await NonPersonalizedItem.findOne({"showcase_id" : showcaseId}, (err, doc) => {
            if(err || !doc) return reject(new ErrorHandler(400, 'Something went wrong'));
        });

        if(showcaseObject.showcase_imageUrl.includes('today-showcases')){
            if (fs.existsSync(`/srv/assets${showcaseObject.showcase_imageUrl}`)) {
                fs.unlink(`/srv/assets${showcaseObject.showcase_imageUrl}`, (err) => {
                    if (err) return reject(new ErrorHandler(500, err.message));
                });
            }
        }

        let deletedItem = await NonPersonalizedItem.findOneAndDelete({"showcase_id" : showcaseId}, (err) => {
            if(err) return reject(new ErrorHandler(500, err.message));
            
            DataVersion.findOneAndUpdate({"collection_id" : "today_nonpersonalized_showcases", "language" : showcaseObject.language }, { $inc: { latest_version: 1 }}, (err) => {
                if (err) return reject(new ErrorHandler(500, err.message));
            });
        });

        resolve({"success" : true});
    });
}

function renameFile(image, showcaseId, oldPath) {
    return new Promise(async (resolve, reject) => {
        if (oldPath.includes('/today-showcase') && fs.existsSync(`/srv/assets${oldPath}`)) {
            fs.unlink(`/srv/assets${oldPath}`, (err) => {
                if (err) return reject(new ErrorHandler(500, err.message));
            });
        }
        let imageName = `${showcaseId}-${Math.floor(100000 + Math.random() * 900000)}.jpg`;
        let currentPath = image.path;
        let destinationPath = path.join(config.get('FilePaths.showcases'), imageName);

        fs.rename(currentPath, destinationPath, (err) => {
            if (err) return reject(new ErrorHandler(500, 'FILE_ERROR'));
        });

        resolve(destinationPath.split('/srv/assets')[1]);
    });
}

module.exports = {
    getStarters,
    publishStarters,
    getSeries,
    publishSeries,
    getPersonalizedShowcases,
    getNonPersonalizedShowcases,
    publishPersonalizedShowcases,
    publishNonPersonalizedShowceses,
    deleteNonPersonalizedShowcase
}