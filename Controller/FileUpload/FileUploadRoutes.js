const Express = require('express');
const Router = Express.Router();
const { Upload } = require('./UploadController');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/upload', VerifyToken, (req, res) => {
    return Upload(req, res);
});

module.exports = Router;
