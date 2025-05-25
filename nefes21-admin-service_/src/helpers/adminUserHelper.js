
const AdminUser = require('../models/nefes21Admin/adminUserModel');
const { ErrorHandler, handleError } = require('../middleware/errorHandler');
const { v4 : uuidv4 } =  require('uuid'); 

const getPanelUsers = () => {
    return new Promise((resolve, reject) => {
        const query = { role : {$ne : 'ROOT'}};
        const projection = { _id : 0, password : 0 };
        const response = (err, users) => {
            if (err) return reject(new ErrorHandler(500, err.message));
            resolve(users);
        }
        AdminUser.find(query, projection, response);
    });
}

function editPanelUser(userCredentials, state){
    return new Promise(async(resolve, reject) => {
        
        const userObject = {
            email : userCredentials.email,
            name : userCredentials.name,
            surname : userCredentials.surname,
            username : userCredentials.username,
            password : userCredentials.password,
            role : userCredentials.role,
            uuid : userCredentials.uuid
        }
        
        if(state === 'new'){
            userObject.uuid = uuidv4();
            AdminUser.create(userObject,(error, user) => {
                if(error) return reject(new ErrorHandler(500, error.message));
                resolve(user);
            });
        }else if(state === 'edit'){
            AdminUser.findOneAndUpdate({uuid : userCredentials.uuid}, userObject, (error, user) => {
                if(error) return reject(new ErrorHandler(500, error.message));
                resolve(user);
            })
        }else{
            return reject(new ErrorHandler(500, 'INVALID_STATE_TYPE'));
        }
    })
}

module.exports = {
    getPanelUsers,
    editPanelUser
}