"use strict";

const mongoose = require('mongoose');
const {Nefes21, Nefes21Admin, Nefes21Analytics} = require('../../config/dbConnection');

const programEnrollmentSchema = new mongoose.Schema({
    program_id : {
        type : String
    },
    enrollment_count : {
        type : Number
    }
});

const ProgramEnrollment = Nefes21.model('program_enrollments', programEnrollmentSchema);

module.exports = ProgramEnrollment;