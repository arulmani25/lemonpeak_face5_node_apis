const Express = require('express');
const Router = Express.Router();
const { create, Login, Details, List, Update, Deletes, Delete } = require('./SubAdminAccessController');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/create', VerifyToken, (req, res) => {
    return create(req, res);
});

Router.post('/subadmin/login', (req, res) => {
    return Login(req, res);
});

Router.get('/getlist', VerifyToken, (req, res) => {
    return List(req, res);
});

Router.post('/getdetailById', VerifyToken, (req, res) => {
    return Details(req, res);
});

Router.delete('/deletes', VerifyToken, (req, res) => {
    return Deletes(req, res);
});

Router.post('/delete', VerifyToken, (req, res) => {
    return Delete(req, res);
});

Router.post('/edit', VerifyToken, (req, res) => {
    return Update(req, res);
});

module.exports = Router;
