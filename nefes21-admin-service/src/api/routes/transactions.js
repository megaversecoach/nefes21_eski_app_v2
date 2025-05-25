const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const dbHelper = require('../../helpers/userHelper');

router.get('/', (req, res, next) => {
    const uuid = req.query.uuid;
    const transactionID = req.query.transactionID;
    if(!uuid && !transactionID) throw new ErrorHandler(400, 'Missing query parameter');

    dbHelper.getTransactionsById(uuid, transactionID)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        })
});

module.exports = router;