"use strict";

const Dimension = require('../models/nefes21/dimensionModel');
const { ErrorHandler, handleError } = require('../middleware/errorHandler');

const getDimensions = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, language: 0 };
        const response = (err, dimension) => {
            if (err) reject(new ErrorHandler(500, err.message));
            resolve(dimension);
        }
        Dimension.find(query, projection, response);
    });
}

module.exports = {
    getDimensions
};