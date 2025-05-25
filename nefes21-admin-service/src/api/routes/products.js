
const express = require('express');
const router = express.Router();
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const db = require('../../helpers/productHelper');

router.get('/', (req, res, next) => {
    db.getAllProducts()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error)
        });
});

module.exports = router;