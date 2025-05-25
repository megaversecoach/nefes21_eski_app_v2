const express = require('express');
const router = express.Router();
const Joi = require('joi');
const programHelper = require('../../helpers/programHelper');
const { ErrorHandler, handleError } = require('../../middleware/errorHandler');
const multer = require('multer');
const config = require('config');

router.get('/', (req, res, next) => {
    const lang = req.query.lang;
    if (!lang) throw new ErrorHandler(400, 'Missing lang field');

    programHelper.getDraftedProgramsByLanguage(lang)
        .then((programs) => {
            res.status(200).json(programs);
        })
        .catch((error) => {
            next(error);
        })
});

router.get('/:program_id', (req, res, next) => {
    const programId = req.params.program_id;
    if (!programId) throw new ErrorHandler(400, 'Missing program_id field');

    programHelper.getDraftedProgramByProgramId(programId)
        .then((program) => {
            if (program === null) {
                throw new ErrorHandler(404, 'Data Not Found');
            }
            res.status(200).json(program);
        })
        .catch((error) => {
            next(error);
        });
});

let storage = multer.diskStorage({
    destination: function (req, files, cb) {
        cb(null, config.get('FilePaths.tempPath'))
    }
})

let upload = multer({ storage: storage });

router.post('/', upload.fields([{
    name: 'program-cover', maxCount: 1
}, {
    name: 'program-background', maxCount: 1
}, {
    name: 'trailer-mp4', maxCount: 1
}, {
    name: 'trailer-cover', maxCount: 1
}
]), (req, res, next) => {
    const programData = JSON.parse(req.body.programData);
    const programState = req.body.state;
    let coverPic = req?.files['program-cover']?.[0];
    let backgorundPic = req?.files['program-background']?.[0];
    let trailerSource = req?.files['trailer-mp4']?.[0];
    let trailerCoverPic = req?.files['trailer-cover']?.[0];

    const { error } = validateProgram(programData);
    if (error) throw new ErrorHandler(400, error.message);

    programHelper.editDraftedProgram(programState, programData, coverPic, backgorundPic, trailerSource, trailerCoverPic)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

router.delete('/', (req,res,next) => {
    let programId = req.body.program_id;
    if(!programId) throw new ErrorHandler(400, 'Missing id field');

    programHelper.deleteDraftedProgram(programId)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => {
            next(error);
        })
});

const validateProgram = (program) => {
    const Schema = Joi.object({
        program_id: Joi.string()
            .allow(''),
        program_title: Joi.string()
            .required(),
        program_description: Joi.string()
            .required(),
        program_information: Joi.string()
            .required(),
        program_gains: Joi.array()
            .required(),
        program_duration: Joi.number()
            .required(),
        author_id: Joi.string()
            .required(),
        program_partCount: Joi.number()
            .required(),
        program_sections: Joi.array()
            .required(),
        program_isNew: Joi.boolean()
            .required(),
        program_isFree: Joi.boolean()
            .required(),
        program_isOnSale: Joi.boolean()
            .required(),
        product_id: Joi.string()
            .allow('',null),
        discounted_product_id: Joi.string()
            .allow('',null),
        discountRate: Joi.number()
            .allow('', null),
        program_isValid: Joi.boolean()
            .required(),
        program_version: Joi.number()
            .required(),
        language: Joi.string()
            .required()
    }).unknown(true);

    return Schema.validate(program);
}

module.exports = router;