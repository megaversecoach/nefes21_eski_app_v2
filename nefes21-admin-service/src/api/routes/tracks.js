"use strict";

const express = require('express');
const router = express.Router();
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const trackHelper = require('../../helpers/trackHelper');
const Joi = require('joi');
const multer = require('multer');
const config = require('config');

router.get('/', (req, res, next) => {
    let contentId = req.query.content_id;
    if (!contentId) throw new ErrorHandler(400, "Missing id field");

    trackHelper.getTracks(contentId)
        .then((tracks) => {
            res.status(200).json(tracks);
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;