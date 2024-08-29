const Express = require('express');
const Router = Express.Router();
const { VerifyToken } = require('../../Helpers/JWSToken');
const { create, listbyrole, list, Details, update, deleteData } = require('./AccessConfigController');

Router.post('/create', (req, res) => {
    return create(req, res);
});

Router.get('/listbyrole', VerifyToken, (req, res) => {
    return listbyrole(req, res);
});

Router.get('/list', (req, res) => {
    return list(req, res);
});

Router.get('/:id', (req, res) => {
    return Details(req, res);
});

Router.put('/:id', (req, res) => {
    return update(req, res);
});

Router.delete('/:id', (req, res) => {
    return deleteData(req, res);
});

module.exports = Router;
