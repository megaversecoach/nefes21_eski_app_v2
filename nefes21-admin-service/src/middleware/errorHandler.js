"use strict";

class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

const handleError = (err, res) => {
    const {statusCode, message} = err;
    console.log(`Error Code : ${statusCode} - Error Message : ${message}`);
    if (err.name === 'UnauthorizedError') {
        res.status(403).json({
            status: "error",
            statusCode: 403,
            message: err.name
        });
    } else {
        res.status(statusCode).json({
            status: "error",
            statusCode,
            message
        });
    }
}

module.exports = {
    ErrorHandler,
    handleError
}