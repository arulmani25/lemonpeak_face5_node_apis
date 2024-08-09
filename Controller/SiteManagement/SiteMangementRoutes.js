const Express = require('express');
const Router = Express.Router();
const {create, List, Details, Update, Delete} = require('./SiteManagementController');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/create', VerifyToken, (req, res) => {
    return create(req, res);
});

Router.get('/list', VerifyToken, (req, res) => {
    return List(req, res);
});

Router.get("/site/:id", VerifyToken, (req, res) => {
    return Details(req, res);
});

Router.delete('/delete/:id', VerifyToken, (req, res) => {
    return Delete(req, res);
});

Router.post('/update', VerifyToken, (req, res) => {
    return Update(req, res);
});

module.exports = Router;
