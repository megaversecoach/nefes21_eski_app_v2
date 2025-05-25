
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const programHelper = require('../../helpers/programHelper');

router.get('/', (req, res, next) => {
    const lang = req.query.lang;
    if(!lang) throw new ErrorHandler(400, 'Missing lang field');
    
    programHelper.getProgramLayoutByLanguage(lang)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        })
});

router.post('/', (req, res, next) => {
    const lang =  req.query.lang;
    if(!lang) throw new ErrorHandler(400, 'Missing lang field');

    const programLayout = req.body.program_layout;
    const {error} = validateProgramLayout(programLayout);
    if(error) throw new ErrorHandler(400, 'Missing lang field');

    programHelper.publishProgramLayout(programLayout,lang)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

const validateProgramLayout = (layout) => {
    const Schema = Joi.array().items(Joi.object({
        program_id : Joi.string()
            .required(),
        program_isDiscounted : Joi.boolean()
            .required(),
        program_label_id : Joi.string()
            .allow('', null),
        orderInSection : Joi.number()
            .required(),
        language : Joi.string()
            .required()
    }));

    return Schema.validate(layout);
}

module.exports = router;