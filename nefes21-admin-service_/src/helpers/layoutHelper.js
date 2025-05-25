"use strict";

const { ErrorHandler, handleError } = require('../middleware/errorHandler');
const DimensionLayout = require('../models/nefes21/dimensionLayoutModel');
const ShowcaseTypes = require('../models/nefes21/showcaseTypeModel');
const QuickStartLayout = require('../models/nefes21/quickStartLayoutModel');
const MoodCheckinLayout = require('../models/nefes21/moodCheckinLayoutModel');
const DataVersion = require('../models/nefes21/dataVersionModel');

const getDimensionLayout = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, __v : 0 };
        const response = (err, dimensionLayout) => {
            if (err) reject(new ErrorHandler(500, err.message));
            resolve(dimensionLayout);
        }
        DimensionLayout.find(query, projection, response);
    });
}

const getShowcaseTypes = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, __v : 0};
        const response = (err, showcaseType) => {
            if (err) reject(new ErrorHandler(500, err.message));
            resolve(showcaseType);
        }
        ShowcaseTypes.find(query, projection, response);
    });
}

const getQuickStartLayout = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, __v : 0};
        const response = (err, quickStartLayout) => {
            if (err) reject(new ErrorHandler(500, err.message));
            resolve(quickStartLayout);
        }
        QuickStartLayout.find(query, projection, response);
    });
}

const getMoodCheckInLayout = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, __v : 0 };
        const response = (err, moodCheckInLayout) => {
            if (err) reject(new ErrorHandler(500, err.message));
            resolve(moodCheckInLayout);
        }
        MoodCheckinLayout.find(query, projection, response);
    });
}

function publishDimensionLayout(dimensionId, lang, dimensitonList){
    return new Promise(async(resolve, reject) => {
        let deletedLayout = await DimensionLayout.deleteMany({"dimension_id" : dimensionId, "language" : lang}, (err) => {
            if(err) return reject(new ErrorHandler(500, err.message));
            
            DimensionLayout.insertMany(dimensitonList, (err) => {
                if(err) return reject(new ErrorHandler(500, err.message));

                DataVersion.findOneAndUpdate({ "collection_id": `dimension_layout_${dimensionId}`, "language" : lang}, { $inc: { latest_version: 1 }}, (err) => {
                    if (err) return reject(new ErrorHandler(500, err.message));

                    resolve({ success: true });
                });
            });

        });
    });
}

function publishQuickStartLayout(lang, qsList, quickStartId){
    return new Promise(async(resolve, reject) => {
        let deletedLayout = await QuickStartLayout.deleteMany({"qs_category_id" : quickStartId, "language" : lang}, (err) => {
            if(err) return reject(new ErrorHandler(500, err.message));
        
            QuickStartLayout.insertMany(qsList, (err) => {
                if(err) return reject(new ErrorHandler(500, err.message));

                DataVersion.findOneAndUpdate({ "collection_id": "quickstart_layout", "language" : lang}, { $inc: { latest_version: 1 }}, (err) => {
                    if (err) return reject(new ErrorHandler(500, err.message));

                    resolve({ success: true });
                });
            });
        });
    });
}

function publishMoodCheckinLayout(lang, moodList, moodId){
    return new Promise(async(resolve, reject) => {
        let deletedLayout = await MoodCheckinLayout.deleteMany({"mood_id" : moodId, "language" : lang}, (err) => {
            if(err) return reject(new ErrorHandler(500, err.message));

            MoodCheckinLayout.insertMany(moodList, (err) => {
                if(err) return reject(new ErrorHandler(500, err.message));

                DataVersion.findOneAndUpdate({ "collection_id": "moodcheckin_layout", "language" : lang}, { $inc: { latest_version: 1 }}, (err) => {
                    if (err) return reject(new ErrorHandler(500, err.message));

                    resolve({ success: true });
                });
            });
        });
    });
}

module.exports = {
    getDimensionLayout,
    getShowcaseTypes,
    publishDimensionLayout,
    getQuickStartLayout,
    getMoodCheckInLayout,
    publishQuickStartLayout,
    publishMoodCheckinLayout
}