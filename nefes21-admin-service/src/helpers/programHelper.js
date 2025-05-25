
const Program = require('../models/nefes21/programsModel');
const DraftedProgram = require('../models/nefes21Admin/draftedProgramsModel');
const ProgramLabel = require('../models/nefes21/programLabelModel');
const ProgramLayout = require('../models/nefes21/programLayoutModel');
const DraftedPart = require('../models/nefes21Admin/draftedPartModel');
const Identifier = require('../models/nefes21Admin/tableIdentifiersModel');
const { ErrorHandler, handleError } = require('../middleware/errorHandler');
const path = require('path');
const config = require('config');
const fs = require('fs');
const DataVersion = require('../models/nefes21/dataVersionModel');
const PartHelper = require('./partHelper');
const ProgramEnrollment = require('../models/nefes21/programEnrollmentCountsModel');

const getProgramsByLanguage = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, __v: 0 };
        const response = (err, programs) => {
            if (err) reject(new ErrorHandler(500, err.message));

            resolve(programs);
        }

        Program.find(query, projection, response);
    });
}

const getDraftedProgramsByLanguage = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, __v: 0 };
        const response = (err, programs) => {
            if (err) reject(new ErrorHandler(500, err.message));

            resolve(programs);
        }

        DraftedProgram.find(query, projection, response);
    });
}

const getDraftedProgramByProgramId = (programId) => {
    return new Promise((resolve, reject) => {
        const query = { "program_id": programId };
        const projection = { _id: 0, __v: 0 };
        const response = (err, programs) => {
            if (err) reject(new ErrorHandler(500, err.message));

            resolve(programs);
        }

        DraftedProgram.findOne(query, projection, response);
    });
}

const getProgramLabelsByLanguage = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, __v: 0 };
        const response = (err, programs) => {
            if (err) reject(new ErrorHandler(500, err.message));

            resolve(programs);
        }

        ProgramLabel.find(query, projection, response);
    });
}

const getProgramLayoutByLanguage = (lang) => {
    return new Promise((resolve, reject) => {
        const query = { "language": lang };
        const projection = { _id: 0, __v: 0 };
        const response = (err, programs) => {
            if (err) reject(new ErrorHandler(500, err.message));

            resolve(programs);
        }

        ProgramLayout.find(query, projection, response);
    });
}

function editDraftedProgram(state, programData, coverPic, backgroundPic, trailerSource, trailerCoverPic) {
    return new Promise(async (resolve, reject) => {
        try {
            let programObject = programData;
            if (state === 'new') {
                if (!coverPic || !backgroundPic || !trailerSource || !trailerCoverPic || !trailerCoverPic) {
                    return reject(new ErrorHandler(400, 'New State requires files'));
                }

                const programId = await Identifier.findOneAndUpdate({ "collection_id": "program_id" }, { $inc: { value: 1 } });

                programObject = Object.assign(programObject, {
                    "program_id": programId.value,
                    "dateCreated": Date.now()
                });
            }

            const oldDraft = await DraftedProgram.findOne({ 'program_id': programObject.program_id }, (err) => {
                if (err) return reject(new ErrorHandler(500, err.message));
            });

            if (coverPic) {
                const coverDest = config.get('FilePaths.draftProgramCover');
                programObject.coverImageUrl = await moveProgramFiles(coverPic.path, coverDest, programObject.program_id, oldDraft?.coverImageUrl);
            }

            if (backgroundPic) {
                const backgroundDest = config.get('FilePaths.draftProgramBackground');
                programObject.bgImageUrl = await moveProgramFiles(backgroundPic.path, backgroundDest, programObject.program_id, oldDraft?.bgImageUrl);
            }

            if (trailerCoverPic) {
                const trailerCoverDest = config.get('FilePaths.draftTrailerCover');
                programObject.trailerCoverImageUrl = await moveProgramFiles(trailerCoverPic.path, trailerCoverDest, programObject.program_id, oldDraft?.trailerCoverImageUrl);
            }

            if (trailerSource) {
                const trailerDest = config.get('FilePaths.draftTrailerMp4');
                programObject.trailerUrl = await moveProgramFiles(trailerSource.path, trailerDest, programObject.program_id, oldDraft?.trailerSource);
            }

            await DraftedProgram.findOneAndUpdate({ "program_id": programObject.program_id }, programObject, { upsert: true });

            resolve({ "success": true });
        } catch (error) {
            return reject(new ErrorHandler(500, error.message));
        }
    });
}

async function deleteDraftedProgram(programId) {
    try {
        let programObject = await DraftedProgram.findOne({ "program_id": programId });
        let coverImagePath = `/srv/assets${programObject.coverImageUrl}`;
        let backgroundImagePath = `/srv/assets${programObject.bgImageUrl}`;
        let trailerSourcePath = `/srv/assets${programObject.trailerUrl}`;
        let trailerCoverPath = `/srv/assets${programObject.trailerCoverImageUrl}`;


        if (coverImagePath.includes('/drafts') && fs.existsSync(coverImagePath)) {
            fs.unlink(coverImagePath, function (err) {
                if (err) throw new Error(err.message);
            });
        }

        if (backgroundImagePath.includes('/drafts') && fs.existsSync(backgroundImagePath)) {
            fs.unlink(backgroundImagePath, function (err) {
                if (err) throw new Error(err.message);
            });
        }

        if (trailerSourcePath.includes('/drafts') && fs.existsSync(trailerSourcePath)) {
            fs.unlink(trailerSourcePath, function (err) {
                if (err) throw new Error(err.message);
            });
        }

        if (trailerCoverPath.includes('/drafts') && fs.existsSync(trailerCoverPath)) {
            fs.unlink(trailerCoverPath, function (err) {
                if (err) throw new Error(err.message);
            });
        }

        const partsOfDeletedProgram = await DraftedPart.find({ "program_id": programId });

        if (partsOfDeletedProgram.length > 0) {
            DraftedPart.deleteMany({ "program_id": programId }, (err) => {
                if (err) throw new Error(err.message);
            });

            partsOfDeletedProgram.forEach((item) => {
                let audioPath = `${config.get('FilePaths.draftPartAudio')}/${item.part_id}.mp3`;
                let videoPath = `${config.get('FilePaths.draftPartVideo')}/${item.part_id}.mp4`;

                let filePath = (item.part_type === 'video') ? videoPath : audioPath;

                if (filePath.includes('/drafts') && fs.existsSync(filePath)) {
                    fs.unlink(filePath, function (err) {
                        if (err) throw new Error(err.message);
                    });
                }
            });
        }

        DraftedProgram.findOneAndDelete({ "program_id": programId }, (err) => {
            if (err) throw new Error(err.message);
        });

        return { success: true }
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
}

function publishProgramLayout(programLayout, lang) {
    return new Promise(async (resolve, reject) => {
        let deletedLayout = await ProgramLayout.deleteMany({ "language": lang }, (err) => {
            if (err) return reject(new ErrorHandler(500, err.message));

            ProgramLayout.insertMany(programLayout, (err) => {
                if (err) return reject(new ErrorHandler(500, err.message));

                DataVersion.findOneAndUpdate({ "collection_id": "program_layout", "language": lang }, { $inc: { latest_version: 1 } }, (err) => {
                    if (err) return reject(new ErrorHandler(500, err.message));

                    resolve({ success: true });
                });
            });
        });
    });
}

async function moveProgramFiles(moveFrom, moveTo, contentId, oldPath) {
    try {
        if (oldPath !== undefined) {
            if (fs.existsSync(`/srv/assets${oldPath}`)) {
                fs.unlink(`/srv/assets${oldPath}`, (err) => {
                    if (err) throw new Error(err.message);
                });
            }
        }
        let basePath = `${contentId}-${Math.floor(100000 + Math.random() * 900000)}`;
        let fileName = (moveTo.includes('videos')) ? `${basePath}.mp4` : `${basePath}.jpg`

        let current = moveFrom;
        let destination = path.join(moveTo, fileName);
        fs.rename(current, destination, (err) => {
            if (err) throw new Error(err.message);
        });

        return destination.split('/srv/assets')[1];
    } catch (error) {
        throw new ErrorHandler(400, 'Something went wrong');
    }
}

function publishProgram(programId) {
    return new Promise(async (resolve, reject) => {
        try {
            let isProgramEdit;
            let publishedProgram = await Program.findOne({ "program_id": programId }, { _id: 0 });
            let draftProgram = await DraftedProgram.findOne({ "program_id": programId }, { _id: 0 });
            if(!draftProgram) return reject(new ErrorHandler(500, 'Program Not Found'));

            let currentProgramVersion = await DataVersion.findOne({ "collection_id": "programs", "language": draftProgram.language });

            if (draftProgram?.coverImageUrl.includes('/drafts')) {
                let coverMoveFrom = `/srv/assets/${draftProgram.coverImageUrl}`;
                draftProgram.coverImageUrl = await moveProgramFiles(coverMoveFrom, config.get('FilePaths.programCover'), programId);
            }

            if (draftProgram?.bgImageUrl.includes('/drafts')) {
                let bgImageFrom = `/srv/assets/${draftProgram.bgImageUrl}`;
                draftProgram.bgImageUrl = await moveProgramFiles(bgImageFrom, config.get('FilePaths.programBackground'), programId);
            }

            if (draftProgram?.trailerCoverImageUrl.includes('/drafts')) {
                let trailerCoverFrom = `/srv/assets/${draftProgram.trailerCoverImageUrl}`;
                draftProgram.trailerCoverImageUrl = await moveProgramFiles(trailerCoverFrom, config.get('FilePaths.trailerCover'), programId);
            }

            if (draftProgram?.trailerUrl.includes('/drafts')) {
                let trailerFrom = `/srv/assets/${draftProgram.trailerUrl}`;
                draftProgram.trailerUrl = await moveProgramFiles(trailerFrom, config.get('FilePaths.trailerMp4'), programId);
            }

            if (publishedProgram === null) draftProgram.program_version = 1;
            else {
                isProgramEdit = await isProgramChange(draftProgram, publishedProgram);
                if (isProgramEdit) draftProgram.program_version = currentProgramVersion.latest_version + 1;
            }

            let partsOfDraftedProgram = await DraftedPart.find({ "program_id": programId }, { _id: 0 });
            const updatedPartVersion = await PartHelper.updatePartVersions(publishedProgram, programId, partsOfDraftedProgram);
            await PartHelper.moveParts(updatedPartVersion);

            let newProgram = await toProgramModel(draftProgram);

            await Program.findOneAndUpdate({ 'program_id': programId }, newProgram, { upsert: true, setDefaultsOnInsert: true }, (err) => {
                if (err) return reject(new ErrorHandler(500, err.message));
            });

            if (publishedProgram === null) {
                await ProgramEnrollment.create({ 'program_id': programId, enrollment_count: 0 });
            }

            await DraftedProgram.findOneAndDelete({ "program_id": programId });

            if (isProgramEdit) {
                await DataVersion.findOneAndUpdate({ "collection_id": "programs", "language": newProgram.language }, { $inc: { "latest_version": 1 } });
            }

            resolve(newProgram);
        } catch (error) {
            reject(new ErrorHandler(500, error.message));
        }
    });
}

function toProgramModel(draftedProgram) {
    try {
        const newProgram = {
            program_id: draftedProgram.program_id,
            program_title: draftedProgram.program_title,
            program_description: draftedProgram.program_description,
            program_information: draftedProgram.program_information,
            program_duration: draftedProgram.program_duration,
            program_gains: draftedProgram.program_gains,
            author_id: draftedProgram.author_id,
            coverImageUrl: draftedProgram.coverImageUrl,
            bgImageUrl: draftedProgram.bgImageUrl,
            program_partCount: draftedProgram.program_partCount,
            program_sections: draftedProgram.program_sections,
            trailerUrl: draftedProgram.trailerUrl,
            trailerCoverImageUrl: draftedProgram.trailerCoverImageUrl,
            program_isNew: draftedProgram.program_isNew,
            program_isFree: draftedProgram.program_isFree,
            program_isOnSale: draftedProgram.program_isOnSale,
            product_id: draftedProgram.product_id,
            discounted_product_id: draftedProgram.discounted_product_id,
            discountRate: draftedProgram.discountRate,
            dateCreated: draftedProgram.dateCreated,
            datePublished: Date.now(),
            program_isValid: draftedProgram.program_isValid,
            program_version: draftedProgram.program_version,
            language: draftedProgram.language
        }

        return newProgram;
    } catch (error) {
        throw new Error(error);
    }
}

async function isProgramChange(draftedProgram, publishedProgram) {
    try {
        let draftObject = draftedProgram;
        ['_id', 'program_version', 'program_gains', 'program_sections'].forEach(i => delete draftObject[i]);

        for (let key of Object.keys(draftObject._doc)) {
            if (draftObject[key] !== publishedProgram[key]) return true;
        }

        if (JSON.stringify(draftObject?.program_gains) !== JSON.stringify(publishedProgram?.program_gains)) {
            return true;
        }

        if (JSON.stringify(draftObject?.program_sections) !== JSON.stringify(publishedProgram?.program_sections)) {
            return true;
        }

        return false;
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
}

module.exports = {
    getProgramsByLanguage,
    getDraftedProgramsByLanguage,
    getDraftedProgramByProgramId,
    getProgramLabelsByLanguage,
    getProgramLayoutByLanguage,
    editDraftedProgram,
    deleteDraftedProgram,
    publishProgram,
    publishProgramLayout
}