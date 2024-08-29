const Express = require('express');
const Router = Express.Router();
const { create, List, Details, Update, Delete, Login, UpdatePassword, ForgotPassword } = require('./UserController');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/createUser', (req, res) => {
    return create(req, res);
});

Router.get('/getUsers', VerifyToken, (req, res) => {
    return List(res, req);
});

Router.get('/users/:id', VerifyToken, (req, res) => {
    return Details(req, res);
});

Router.put('/users/:id', VerifyToken, (req, res) => {
    return Update(req, res);
});

Router.delete('/users/:id', VerifyToken, (req, res) => {
    return Delete(req, res);
});

Router.post('/login', (req, res) => {
    return Login(req, res);
});

Router.post('/updatepassword', VerifyToken, (req, res) => {
    return UpdatePassword(req, res);
});

// forgotpassword
Router.post('/forgotpassword', (req, res) => {
    return ForgotPassword(req, res);
});

module.exports = Router;
