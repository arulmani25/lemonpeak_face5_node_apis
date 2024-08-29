const Express = require('express');
const Router = Express.Router();
const { create, List, Details, Update, Delete } = require('./TempCheckListController');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/create', VerifyToken, (req, res) => {
    return create(req, res);
});

Router.get('/list', VerifyToken, (req, res) => {
    return List(req, res);
});

Router.get('/getdata/:id', VerifyToken, (req, res) => {
    return Details(req, res);
});

Router.put('/updatechecklist/:id', VerifyToken, (req, res) => {
    return Update(req, res);
});

Router.delete('/removechecklist/:id', VerifyToken, (req, res) => {
    return Delete(req, res);
});

module.exports = Router;
