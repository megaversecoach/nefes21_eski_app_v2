
const Product = require('../models/nefes21/productModel');
const Supplier = require('../models/nefes21Admin/supplierModel');
const { ErrorHandler, handleError } = require('../middleware/errorHandler');

const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        const projection = {_id : 0, __v : 0};
        const response = (err, products) => {
            if (err) reject(new ErrorHandler(500, err.message));

            resolve(products);
        }
        Product.find({},projection,response);
    });
}

const getAllSuppliers = () => {
    return new Promise((resolve, reject) => {
        const projection = {_id : 0, __v : 0};
        const response = (err, suppliers) => {
            if (err) reject(new ErrorHandler(500, err.message));

            resolve(suppliers);
        }
        Supplier.find({},projection,response);
    });
}


module.exports = {
    getAllProducts,
    getAllSuppliers
}