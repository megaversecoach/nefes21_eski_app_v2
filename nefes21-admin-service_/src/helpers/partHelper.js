
const Part = require('../models/nefes21/partsModel');
const DraftedPart = require('../models/nefes21Admin/draftedPartModel');
const { ErrorHandler, handleError } = require('../middleware/errorHandler');
const DraftedProgram = require('../models/nefes21Admin/draftedProgramsModel');
const DataVersion = require('../models/nefes21/dataVersionModel');
const path = require('path');
const config = require('config');
const fs = require('fs');

const getPartsByProgramId = (programId) => {
    return new Promise((resolve, reject) => {
        const query = { "program_id": programId };
        const projection = { _id: 0, __v: 0 };
        const response = (err, programs) => {
            if (err) reject(new ErrorHandler(500, err.message));

            resolve(programs);
        }

        Part.find(query, projection, response);
    });
}

const getDraftedPartsByProgramId = (programId) => {
    return new Promise((resolve, reject) => {
        const query = { "program_id": programId };
        const projection = { _id: 0, __v: 0 };
        const response = (err, programs) => {
            if (err) reject(new ErrorHandler(500, err.message));

            resolve(programs);
        }

        DraftedPart.find(query, projection, response);
    });
}

function editDraftedParts(status, partData, partVideo, partAudio) {
    return new Promise(async (resolve, reject) => {
        try {
            let partObject = partData;
            let programId = partObject.program_id;
            if (status === 'new') {
                let partId = `${programId}-${Math.floor(100000 + Math.random() * 900000)}`;
                partObject = Object.assign(partObject, { "part_id": partId });
            }

            if (partVideo) {
                let videoPath = config.get('FilePaths.draftPartVideo');
                let videoUrl = await movePartFile(partVideo.path, videoPath, partObject.part_id);
            }

            if (partAudio) {
                let audioPath = config.get('FilePaths.draftPartAudio');
                let videoUrl = await movePartFile(partAudio.path, audioPath, partObject.part_id);
            }

            DraftedPart.findOneAndUpdate({ "part_id": partObject.part_id }, partObject, { upsert: true }, async (err, doc) => {
                if (err) throw new Error(err.message);

                let isProgramUpdated = await updateProgramByParts(partObject.program_id);

                resolve({ "success": true });
            });
        } catch (error) {
            reject(new ErrorHandler(500, error.message));
        }
    });
}

function addPartsToDraft(partList) {
    return new Promise(async (resolve, reject) => {
        for (let item of partList) {
            let part = await DraftedPart.findOneAndUpdate({ "part_id": item.part_id }, item,
                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                }).exec();
        }

        resolve({ success: true });
    });
}

async function movePartFile(moveFrom, moveTo, trackId) {
    try {
        let fileName = (moveTo.includes('videos')) ? `${trackId}.mp4` : `${trackId}.mp3`

        if (fs.existsSync(`${moveTo}/${fileName}`) && `${moveTo}/${fileName}`.includes('drafts')) {
            fs.unlink(`${moveTo}/${fileName}`, (err) => {
                if (err) throw new Error(err.message);
            });
        }

        let current = moveFrom;
        let destination = path.join(moveTo, fileName);
        fs.rename(current, destination, (err) => {
            if (err) throw new Error(err.message);
        });

        return destination.split('/srv/private-assets')[1];
    } catch (error) {
        throw new Error(error.message);
    }
}

async function updateProgramByParts(programId) {
    try {
        let programDuration = 0;
        let partCount = 0;

        const parts = await DraftedPart.find({ "program_id": programId }, (err) => {
            if (err) throw new Error(err.message);
        });


        for (let item of parts) {
            if (item.part_isValid === true) {
                partCount += 1;
                if (item.item_type !== 'quest') programDuration += item.part_duration
            }
        }

        const program = await DraftedProgram.findOneAndUpdate({ "program_id": programId },
            {
                "program_duration": programDuration,
                "program_partCount": partCount
            }, (err) => {
                if (err) throw new Error(err.message);
            });

        return true;
    } catch (error) {
        throw new Error(error.message);
    }
}

function deleteDraftedPart(partId) {
    return new Promise(async(resolve, reject) => {
        let partData = await DraftedPart.findOne({ "part_id": partId }, (err) => {
            if (err) return reject(new ErrorHandler(500, "Something went wrong"));
        });

        let audioPath = `${config.get('FilePaths.draftPartAudio')}/${partId}.mp3`;
        let videoPath = `${config.get('FilePaths.draftPartVideo')}/${partId}.mp4`;

        let filePath = (partData.part_type === 'video') ? videoPath : audioPath;

        if (filePath.includes('/drafts') && fs.existsSync(filePath)) {
            fs.unlink(filePath, function (err) {
                if (err) throw new Error(err.message);
            });
        }

        const deletedProgram = await DraftedPart.findOneAndDelete({"part_id" : partId}, (err, doc) => {
            if(err) throw new Error(err.message);
        });

        let isProgramUpdated = await updateProgramByParts(partData.program_id);

        resolve({ success: true });
    });
}

async function moveParts(partList) {
    try {
        partList.forEach(async (item) => {
            let draftSourcePath = (item.part_type === 'video') ?
                `${config.get("FilePaths.draftPartVideo")}/${item.part_id}.mp4`
                : `${config.get("FilePaths.draftPartAudio")}/${item.part_id}.mp3`;
            
            if (fs.existsSync(draftSourcePath)) {
                let sourcePath = (item.part_type === 'video') ?
                    `${config.get("FilePaths.partVideo")}/${item.part_id}.mp4`
                    : `${config.get("FilePaths.partAudio")}/${item.part_id}.mp3`;
                
                let deletedSource = await fs.rename(draftSourcePath, sourcePath, (err) => {
                    if (err) throw new ErrorHandler(500, err.message);
                });
            }

            let part = await Part.findOneAndUpdate({ "part_id": item.part_id }, item, { upsert: true }, (err) => {
                if (err) throw new ErrorHandler(500, err.message);

                DraftedPart.findOneAndDelete({ "part_id": item.part_id }, (err, doc) => {
                    if (err) throw new ErrorHandler(500, err.message);
                });
            });
        });
        return true;
    } catch (error) {
        return new ErrorHandler(500, error.message);
    }
}

async function updatePartVersions(publishedProgram, programId, partList) {
    try {
        let partsLang = partList?.[0].language;
        let changedParts = new Set();

        let publishedParts = await Part.find({ "program_id": programId }, { _id: 0 });

        for (let part of partList) {
            let item = publishedParts.find((publishedPart) => publishedPart.part_id === part.part_id);
            if (publishedProgram === null) {
                part.part_version = 1;
            }
            else if (typeof item === 'undefined') {
                changedParts.add(part.part_id);
            }
            else {
                delete part._id;
                delete part.part_version;
                delete part.__v;
                for (let key of Object.keys(part._doc)) {
                    if (item !== undefined && (part[key] !== item[key])) changedParts.add(part.part_id);
                }
            }
        }

        if (changedParts.size > 0) {
            let currentPartVersion = await DataVersion.findOneAndUpdate({ "collection_id": "parts", "language": partsLang }, { $inc: { latest_version: 1 } }, { new: false });
            partList.forEach((part) => {
                if (changedParts.has(part.part_id)) part.part_version = currentPartVersion.latest_version + 1;
            });
        }
        return partList;
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
}

module.exports = {
    getPartsByProgramId,
    getDraftedPartsByProgramId,
    editDraftedParts,
    addPartsToDraft,
    deleteDraftedPart,
    moveParts,
    updatePartVersions
}