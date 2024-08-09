const Express = require('express');
const Router = Express.Router();
const {createAttendance, Getlaststatus, List, EmpList} = require('./AttendanceController');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/create', VerifyToken, (req, res) => {
    return createAttendance(req, res);
});

Router.get('/getlaststatus', VerifyToken, (req, res) => {
    return Getlaststatus(req, res);
});

Router.post('/list', VerifyToken, (req, res) => {
    return List(req, res);
});

Router.post('/emplist', VerifyToken, (req, res) => {
    return EmpList(req, res);
});

module.exports = Router;
