
const express = require('express');
const router = express.Router();
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const userHelper = require('../../helpers/userHelper');


router.get('/:session_token', (req, res, next) => {
    const session_token = req.params.session_token;
    if(!session_token) throw new ErrorHandler(400, 'missing session_token field');

    const page = req.query.page !== undefined ? parseInt(req.query.page) : undefined;
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : undefined;

    userHelper.getSessionsBySessionToken(session_token, page, limit)
        .then((tokens) => {
            res.status(200).json(tokens);
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;
