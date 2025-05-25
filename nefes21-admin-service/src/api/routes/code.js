
const express = require('express');
const router = express.Router();
const {ErrorHandler, handleError} = require('../../middleware/errorHandler');
const codeHelper = require('../../helpers/codeHelper');
const Joi = require('joi');

router.get('/promo', (req, res, next) => {
    codeHelper.getAllPromoCodes()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

router.get('/prepaid', (req, res, next) => {
    codeHelper.getAllPrepaidCodes()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/promo', (req, res, next) => {
    const {error} = validatePromoCode(req.body);
    if(error) throw new ErrorHandler(400, error.message);

    codeHelper.publishNewPromoCode(req.body)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/prepaid', (req, res, next) => {
   const {error} = validatePrepaidCode(req.body);
    if(error) throw new ErrorHandler(400, error.message);
    
    codeHelper.publishPrepaidCodes(req.body)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            next(error);
        })
});

router.post('/prepaid/refund', (req, res, next) => {
    const codeId = req.body.code_id;
    if(!codeId) throw new ErrorHandler(400, 'Missing code_id');

    codeHelper.refundPrepaidCode(codeId)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => {
            next(error)
        });
});


const validatePromoCode = (promoCode) => {
    const Schema = Joi.object({
        code_id : Joi.string()
            .required(),
        product_id : Joi.string()
            .required(),
        supplier_id : Joi.string()
            .required(),
        expiration_date : Joi.string()
            .required(),
        code_isValid : Joi.boolean()
            .required()
    });

    return Schema.validate(promoCode);
}

const validatePrepaidCode = (prepaidCode) => {
    const Schema = Joi.object({
        product_id : Joi.string()
            .required(),
        supplier_id : Joi.string()
            .required(),
        quantity : Joi.number()
            .required()
    });

    return Schema.validate(prepaidCode);
}

module.exports = router;