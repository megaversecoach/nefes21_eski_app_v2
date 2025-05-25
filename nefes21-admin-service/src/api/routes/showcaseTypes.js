"use strict";

const express = require('express');
const router = express.Router();
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const layoutHelper = require('../../helpers/layoutHelper');

router.get('/', (req, res, next) => {
    const lang = req.query.lang;
    if(!lang) throw new ErrorHandler(400,'Missing field lang');

    layoutHelper.getShowcaseTypes(lang)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router