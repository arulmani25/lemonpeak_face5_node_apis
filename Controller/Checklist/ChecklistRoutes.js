const Express = require('express');
const Router = Express.Router();
const {
    createCheckList,
    List,
    Details,
    Update,
    DeleteChecklist,
    GetMobileChecklist
} = require('./ChecklistController');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/create', VerifyToken, (req, res) => {
    return createCheckList(req, res);
});

Router.get('/list', VerifyToken, (req, res) => {
    return List(req, res);
});

Router.get('/getchecklist', VerifyToken, (req, res) => {
    return Details(req, res);
});

Router.post('/updatechecklist/:id', VerifyToken, (req, res) => {
    return Update(req, res);
});

Router.delete('/removechecklist/:id', VerifyToken, (req, res) => {
    return DeleteChecklist(req, res);
});

module.exports = Router;
