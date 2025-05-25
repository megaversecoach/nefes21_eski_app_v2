const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { ErrorHandler, handleError } = require('../../middleware/errorHandler');
const partHelper = require('../../helpers/partHelper');
const multer = require('multer');
const config = require('config');

router.get('/', (req, res, next) => {
    const programId = req.query.program_id;
    if (!programId) throw new ErrorHandler(400, 'Missing program_id field');

    partHelper.getDraftedPartsByProgramId(programId)
        .then((parts) => {
            res.status(200).json(parts);
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
    name: 'part-video', maxCount: 1
}, {
    name: 'part-audio', maxCount: 1
}]), (req, res, next) => {
    try {
        let partData, partList;
        if(req.body.partList) partList = JSON.parse(req.body?.partList);
        if(req.body.partData) partData = JSON.parse(req.body?.partData);
        let state = req.body.state;

        let partVideo = req?.files?.['part-video']?.[0];
        let partAudio = req?.files?.['part-audio']?.[0];

        if (partData) {
            const { error } = validateParts(partData);
            if (error) throw new ErrorHandler(400, error.message);

            partHelper.editDraftedParts(state, partData, partVideo, partAudio)
                .then((data) => {
                    res.status(200).json(data);
                });
        } else {
            partHelper.addPartsToDraft(partList)
                .then((data) => {
                    res.status(200).json(data);
                });
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/', (req, res, next) => {
    let partId = req.body.part_id;
    if(!partId) throw new ErrorHandler(400, 'Missing part_id field');

    partHelper.deleteDraftedPart(partId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        })
});

const validateParts = (parts) => {
    const Schema = Joi.object({
        part_id: Joi.string()
            .allow('', null),
        part_title: Joi.string()
            .required(),
        part_label: Joi.string()
            .required(),
        part_duration: Joi.number()
            .allow(null),
        part_type: Joi.string()
            .required(),
        quest_title: Joi.string()
            .allow('', null),
        quest_information: Joi.string()
            .allow('', null),
        orderInSection: Joi.number(),
        section_id: Joi.string()
            .required(),
        program_id: Joi.string()
            .required(),
        soundscape_id: Joi.string()
            .allow('', null),
        soundscape_volume: Joi.number()
            .allow('', null),
        part_isValid: Joi.boolean()
            .required(),
        part_version: Joi.number()
            .required(),
        language: Joi.string()
            .required()
    }).unknown(true);

    return Schema.validate(parts);

}

module.exports = router;