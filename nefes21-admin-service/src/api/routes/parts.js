
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const partHelper = require('../../helpers/partHelper');

router.get('/',(req, res, next) => {
    const programId = req.query.program_id;
    if(!programId) throw new ErrorHandler(400, 'Missing program_id field');

    partHelper.getPartsByProgramId(programId)
        .then((parts) => {
            res.status(200).json(parts);
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;