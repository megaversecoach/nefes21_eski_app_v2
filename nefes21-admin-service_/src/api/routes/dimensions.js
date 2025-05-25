"use strict";

const express = require('express');
const router = express.Router();
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const layoutHelper = require('../../helpers/dimensionHelper');

router.get('/', (req,res,next) => {
    let lang = req.query.lang;
    if(!lang) throw new ErrorHandler(400, 'Missing lang field');

    layoutHelper.getDimensions(lang)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            next(err);
        })
});

module.exports = router;