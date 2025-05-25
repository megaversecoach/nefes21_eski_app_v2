"use strict";

const User = require('../models/nefes21/userModel');
const UserExperience = require('../models/nefes21/userExperienceModel');
const SessionToken = require('../models/nefes21/sessionTokenModel');
const Session = require('../models/nefes21/sessionModel');
const PurchaseEvents = require('../models/nefes21/purchaseEventModel')
const { ErrorHandler, handleError } = require('../middleware/errorHandler');
const Transaction = require('../models/nefes21/transactionModel');

const getUserCredentials = (uuid, email, referralCode) => {
    const query = (uuid !== undefined) ? { "uuid": uuid }
        : (email !== undefined) ? { "email": email }
            : { "referal_code": referralCode };
            
    return new Promise((resolve, reject) => {
        const projection = { _id: 0, __v: 0 };
        const response = (err, users) => {
            if (err) return reject(new ErrorHandler(500, err));
            resolve(users);
        }
        User.findOne(query, projection, response);
    });
}

const getTransactionsById = (uuid, transactionId) => {
    return new Promise((resolve, reject) => {
        const query = (uuid !== undefined) ? { "uuid": uuid }
            : { "transaction_id": transactionId }

        const projection = { _id: 0 };

        Transaction.find(query, projection, {sort : {purchase_date : -1}} , (err, docs) => {
            if (err) return reject(new ErrorHandler(500, err));
            if (!docs) return reject(new ErrorHandler(404, 'Not Found'));

            resolve(docs);
        });
    });
}

const getUserExperienceByUuid = (uuid) => {
    return new Promise((resolve, reject) => {
        const query = { uuid: uuid };
        const projection = { _id: 0, __v: 0 };
        const response = (err, ux) => {
            if (err || !ux) return reject(new ErrorHandler(500, `Something went wrong. Err : ${err}`));
            resolve(ux);
        }
        UserExperience.findOne(query, projection, response);
    });
}

const getSessionTokensByUuid = (uuid) => {
    return new Promise((resolve, reject) => {
        const query = { "uuid": uuid };
        const projection = { _id: 0, __v: 0 };
        const response = (err, tokens) => {
            if (err || !tokens) return reject(new ErrorHandler(500, `Something went wrong. Err : ${err}`));
            resolve(tokens);
        }
        SessionToken.find(query, projection, {sort : {dateCreated : -1}} ,response);
    });
}

const getSessionsBySessionToken = (sessionToken, page, limit) => {
    return new Promise((resolve, reject) => {
        const skipIndex = (page - 1) * limit;
        const query = { "session_token": sessionToken };
        const projection = { _id: 0, __v: 0 }


        Session.count(query, (err, totalCount) => {
            if (err) return reject(new ErrorHandler(500, `Something went wrong. Err : ${err}`));

            Session.find(query, projection, { skip: skipIndex, limit: limit, sort: { dateStarted: -1 } }, (err, data) => {
                if (err) return reject(new ErrorHandler(500, `Something went wrong. Err : ${err}`));

                const responseObject = {
                    "currentPage": page,
                    "limit": limit,
                    "totalPage": Math.ceil(totalCount / limit),
                    "totalItem": totalCount,
                    "data": data,
                }

                resolve(responseObject);
            });
        });

    });
}

const getUsersPurchaseEvents = (uuid) => {
    return new Promise((resolve, reject) => {
        const query = { "uuid" : uuid };
        const projection = { _id: 0 };
        const response = (err, events) => {
            if (err) return reject(new ErrorHandler(500, `Something went wrong. Err : ${err}`));
            resolve(events);
        }
        PurchaseEvents.find(query, projection, {sort : {dateCreated : -1}} ,response);
    });
}

module.exports = {
    getUserCredentials,
    getUserExperienceByUuid,
    getSessionTokensByUuid,
    getSessionsBySessionToken,
    getTransactionsById,
    getUsersPurchaseEvents
}