
const express = require('express');
const router = express.Router();
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const userHelper = require('../../helpers/userHelper');

router.get('/:uuid', (req, res, next) => {
    const uuid = req.params.uuid;
    if(!uuid) throw new ErrorHandler(400, 'Missing uuid');

    userHelper.getSessionTokensByUuid(uuid)
        .then((tokens) => {
            res.status(200).json(tokens);
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;
