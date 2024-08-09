const Express = require('express');
const Router = Express.Router();
const {createActivity, activities, getList,update,deleteActivity,mobileActivity} = require('./ActivitControllers');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/createActivity', VerifyToken, (req, res) => {
    return createActivity(req, res);
});

Router.get('/activities', VerifyToken, (req, res) => {
    return activities(req, res);
});

Router.get('/activities/:id', VerifyToken, (req, res) => {
    return getList(req, res);
});

Router.post('/updateActivities', VerifyToken, (req, res) => {
    return update(req, res);
});

Router.delete('/activities/:id', VerifyToken, (req, res) => {
    return deleteActivity(req, res);
});

Router.get('//mobile/activities', VerifyToken, (req, res) => {
    return mobileActivity(req, res);
});


module.exports = Router;
