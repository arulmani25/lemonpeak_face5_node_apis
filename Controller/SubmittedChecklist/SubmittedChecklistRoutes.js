const Express = require('express');
const Router = Express.Router();
const { create, List, SubmittedjobList, Update, Delete } = require('./SubmittedChecklistController');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/submit', VerifyToken, (req, res) => {
    return create(req, res);
});

Router.get('/getlist', VerifyToken, (req, res) => {
    return List(req, res);
});

Router.put('/update/:id', VerifyToken, (req, res) => {
    return Update(req, res);
});

Router.delete('/cheklist/:id', VerifyToken, (req, res) => {
    return Delete(req, res);
});

Router.get('/listsubmittedjobs', VerifyToken, (req, res) => {
    return SubmittedjobList(req, res);
});

module.exports = Router;
