const Express = require('express');
const Router = Express.Router();
const {create, List, Details, Update, Delete} = require('./SubActivityController');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/createSubActivity', VerifyToken, (req, res) => {
    return create(req, res);
});

Router.get('/subactivities', VerifyToken, (req, res) => {
    return List(req, res);
});

Router.get("/subactivities/:id", VerifyToken, (req, res) => {
    return Details(req, res);
});

Router.delete('/subactivities/:id', VerifyToken, (req, res) => {
    return Delete(req, res);
});

Router.post('/updateSubactivities', VerifyToken, (req, res) => {
    return Update(req, res);
});

module.exports = Router;
