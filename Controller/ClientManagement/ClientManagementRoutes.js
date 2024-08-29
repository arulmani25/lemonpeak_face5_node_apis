const Express = require('express');
const Router = Express.Router();
const {
    create,
    List,
    Details,
    Update,
    UpdateStatus,
    LinkSite,
    UnlinkSite,
    DeleteClientManagement
} = require('./ClientManagementController');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/create', VerifyToken, (req, res) => {
    return create(req, res);
});

Router.get('/list', VerifyToken, (req, res) => {
    return List(req, res);
});

Router.get('/client/:id', VerifyToken, (req, res) => {
    return Details(req, res);
});

Router.post('/update', VerifyToken, (req, res) => {
    return Update(req, res);
});

Router.put('/updatestatus/:id', VerifyToken, (req, res) => {
    return UpdateStatus(req, res);
});

Router.put('/linksite/:id', VerifyToken, (req, res) => {
    return LinkSite(req, res);
});

Router.put('/unlinksite/:id', VerifyToken, (req, res) => {
    return UnlinkSite(req, res);
});

Router.delete('/delete/:id', VerifyToken, (req, res) => {
    return DeleteClientManagement(req, res);
});

module.exports = Router;
