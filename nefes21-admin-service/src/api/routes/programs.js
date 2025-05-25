
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const programHelper = require('../../helpers/programHelper');

router.get('/', (req, res, next) => {
    const lang = req.query.lang;
    if(!lang) throw new ErrorHandler(400, 'Missing lang field');
    
    programHelper.getProgramsByLanguage(lang)
        .then((programs) => {
            res.status(200).json(programs);
        })
        .catch((error) => {
            next(error);
        })
});

router.post('/', (req, res, next) => {
    const programId = req.body.program_id;
    if(!programId) throw new ErrorHandler(400, 'Missing program_id field');

    programHelper.publishProgram(programId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;