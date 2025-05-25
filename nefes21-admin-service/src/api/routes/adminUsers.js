
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const adminUserHelper = require('../../helpers/adminUserHelper');
const { ErrorHandler, handleError } = require('../../middleware/errorHandler');

router.get('/', (req, res, next) => {
    adminUserHelper.getPanelUsers()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        })
});

router.post('/', (req, res, next) => {
    const state = req.query.state;

    const { error } = validateAdminPanelUser(req.body);
    if (error) throw new ErrorHandler(400, error.message);

    adminUserHelper.editPanelUser(req.body, state)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

const validateAdminPanelUser = (panelUser) => {
    const Schema = Joi.object({
        uuid : Joi.string()
            .allow(""),
        name: Joi.string()
            .required(),
        surname: Joi.string()
            .required(),
        username: Joi.string()
            .required(),
        email: Joi.string()
            .required(),
        password: Joi.string()
            .required(),
        role: Joi.string()
            .required()
            .valid('ADMIN', 'ROOT', 'EDITOR', 'SUPPORT')
    });

    return Schema.validate(panelUser);
}

module.exports = router;