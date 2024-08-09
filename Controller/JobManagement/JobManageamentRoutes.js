const Express = require('express');
const Router = Express.Router();
const {create, List, Details, Update, UpdateStatus, TrackEmployee, Dashboard, Graphdata, Generatepdf,MobileJoblist, DeleteJobManagement} = require('./JobManagementController');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/create', VerifyToken, (req, res) => {
    return create(req, res);
});

Router.get('/list', VerifyToken, (req, res) => {
    return List(req, res);
});

Router.get("/job/:id", VerifyToken, (req, res) => {
    return Details(req, res);
});

Router.post('/update', VerifyToken, (req, res) => {
    return Update(req, res);
});

Router.put('/updatestatus/:id', VerifyToken, (req, res) => {
    return UpdateStatus(req, res);
});

Router.get('/getemployeetracking', (req, res) => {
    return TrackEmployee(req, res);
});

Router.post('/dashboard', (req, res) => {
    return Dashboard(req, res);
});

Router.delete('/delete/:id', VerifyToken, (req, res) => {
    return DeleteJobManagement(req, res);
});

Router.post('/graphdata', VerifyToken, (req, res) => {
    return Graphdata(req, res);
});

Router.post('/generatepdf', (req, res) => {
    return Generatepdf(req, res);
});

Router.get('/mobile/joblist', VerifyToken, (req, res) => {
    return MobileJoblist(req, res);
});


module.exports = Router;
