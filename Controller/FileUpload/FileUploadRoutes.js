const Express = require('express');
const Router = Express.Router();
const { Upload } = require('./UploadController');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/upload', VerifyToken, (request, response) => {
    try {
        let { error, message, data } = Upload(request);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

module.exports = Router;
