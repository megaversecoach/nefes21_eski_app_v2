
const { ErrorHandler, handleError } = require('../middleware/errorHandler');
const PromoCode = require('../models/nefes21/promoCodeModel');
const PrepaidCode = require('../models/nefes21/prepaidCodeModel');
const User = require('../models/nefes21/userModel');
const Transaction = require('../models/nefes21/transactionModel');
const cryptoRandomString = require('crypto-random-string');


const getAllPromoCodes = () => {
    return new Promise((resolve, reject) => {
        const projection = { _id: 0, __v: 0 };
        const response = (err, promo) => {
            if (err) reject(new ErrorHandler(500, err.message));

            resolve(promo);
        }
        PromoCode.find({}, projection, response);
    });
}

const getAllPrepaidCodes = () => {
    return new Promise((resolve, reject) => {
        const projection = { _id: 0, __v: 0 };
        const response = (err, promo) => {
            if (err) reject(new ErrorHandler(500, err.message));

            resolve(promo);
        }
        PrepaidCode.find({}, projection, response);
    });
}

function publishNewPromoCode(codeCredentials) {
    return new Promise((resolve, reject) => {
        PromoCode.updateOne({ "code_id": codeCredentials.code_id }, codeCredentials, { upsert: true, setDefaultsOnInsert: true }, (err, doc) => {
            if (err) reject(new ErrorHandler(500, err.message));
            
            resolve(codeCredentials);
        });
    });
}

function publishPrepaidCodes(codeCredentials){
    return new Promise((resolve, reject) => {
        let prepaidCodes = [];
        let quantity = codeCredentials.quantity;
        for(let i = 0; i < quantity; i++){
            const codeObject = {
                code_id : `X${cryptoRandomString({length: 6, type: 'distinguishable'})}`,
                product_id : codeCredentials.product_id,
                supplier_id : codeCredentials.supplier_id,
                expiration_date : Date.now() + 63072000000,
            }

            prepaidCodes.push(codeObject);
        }

        PrepaidCode.insertMany(prepaidCodes, (err, docs) => {
            if (err) reject(new ErrorHandler(500, err.message));

            resolve(prepaidCodes);
        });
    });
}

function refundPrepaidCode(codeId){
    return new Promise(async(resolve, reject) => {
        let prepaidCode = await PrepaidCode.findOne({"code_id" : codeId}, (err) => {
            if(err) reject(new ErrorHandler(500, err.message));
        });

        if(prepaidCode.code_isRedeemed === false){  
            PrepaidCode.findOneAndUpdate({"code_id" : codeId}, {"code_isValid" : false}, (err) => {
                if(err) reject(new ErrorHandler(500, err.message));

                resolve({success : true});
            });
        }else{
            Transaction.findOne({"code_id" : codeId}, (err, transactionOfCode) => {
                if(err || !transactionOfCode) reject(new ErrorHandler(500, 'Something went wrong'));

                User.findOne({"uuid" : transactionOfCode?.uuid}, (err, user) => {
                    if(err || !user) reject(new ErrorHandler(500, 'Something went wrong'));

                    if(user?.subscriptions?.transaction_id === transactionOfCode.transaction_id){
                        User.findOneAndUpdate({"uuid" : user.uuid}, {$unset : {subscriptions : 1}}, (err) => {
                            if(err) reject(new ErrorHandler(500, err.message));

                            Transaction.findOneAndUpdate({"transaction_id" : transactionOfCode.transaction_id},{"isRefunded" : true}, (err) => {
                                if(err) reject(new ErrorHandler(500, err.message));
                            });
                        });
                    }
                    PrepaidCode.findOneAndUpdate({"code_id" : codeId}, {"code_isValid" : false}, (err) => {
                        if(err) reject(new ErrorHandler(500, err.message));
                        
                        resolve({success : true});
                    });
                });
            });
        }
    });
}


module.exports = {
    refundPrepaidCode,
    publishPrepaidCodes,
    publishNewPromoCode,
    getAllPromoCodes,
    getAllPrepaidCodes
}

