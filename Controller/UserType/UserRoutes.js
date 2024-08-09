const Express = require('express');
const Router = Express.Router();
const {create, List, Details, Update, Delete} = require('./UserTypeController');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/createUserType',VerifyToken, (req, res) => {
    return create(req, res);
});

Router.get('/getUserType', VerifyToken, (req, res) => {
    return List(req, res);
});

Router.get('/userType/:id', VerifyToken, (req, res) => {
    return Details(req, res);
});

Router.put('/updateUserType/:id', VerifyToken, (req, res) => {
    return Update(req, res);
});

Router.delete("/userType/:id", VerifyToken, (req, res) => {
    return Delete(req, res);
});

module.exports = Router;
