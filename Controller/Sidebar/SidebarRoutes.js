const Express = require('express');
const Router = Express.Router();
const {create, List, SidebarItemsList,Details, Update, DeleteSidebarItem} = require('./SidebarController');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/sidebar-items', VerifyToken, (req, res) => {
    return create(req, res);
});

Router.get('/listbyrole', VerifyToken, (req, res) => {
    return List(req, res);
});

Router.get("/sidebar-items", VerifyToken, (req, res) => {
    return SidebarItemsList(req, res);
});

Router.get('/sidebar-items/:id', VerifyToken, (req, res) => {
    return Details(req, res);
});

Router.put('/sidebar-items/:id', VerifyToken, (req, res) => {
    return Update(req, res);
});

Router.delete('/sidebar-items/:id', VerifyToken, (req, res) => {
    return DeleteSidebarItem(req, res);
});

module.exports = Router;
