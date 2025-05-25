"use strict";

const Category = require('../models/nefes21/categoriesModel');
const QuickStartCategory = require('../models/nefes21/quickStartCategoryModel');
const DataVersion = require('../models/nefes21/dataVersionModel');
const { ErrorHandler, handleError } = require('../middleware/errorHandler');

const getCategories = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, language: 0, __v : 0};
        const response = (err, category) => {
            if (err) reject(new ErrorHandler(500, err.message));
            resolve(category);
        }
        Category.find(query, projection, response);
    });
}

const getQuickStartCategories = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, language: 0 };
        const response = (err, qsCategory) => {
            if (err) reject(new ErrorHandler(500, err.message));
            resolve(qsCategory);
        }
        QuickStartCategory.find(query, projection, response);
    });
}

function publishCategories(categories, dimensionId, lang){
    return new Promise(async(resolve, reject) => {
        let deletedCategories = await Category.deleteMany({ "dimension_id": dimensionId, "language": lang }, (err) => {
            if (err) return reject(new ErrorHandler(500, err.message));

            Category.insertMany(categories, (err) => {
                if (err) return reject(new ErrorHandler(500, err.message));

                DataVersion.findOneAndUpdate({ "collection_id": "categories", "language" : lang }, { $inc: { latest_version: 1 } }, (err) => {
                    if (err) return reject(new ErrorHandler(500, err.message));

                    resolve({ success: true });
                });
            });
        });
    });
}

module.exports = {
    getCategories,
    getQuickStartCategories,
    publishCategories
};