const Express = require('express');
const Router = Express.Router();
const { Create, Login, Details, List, Update, Deletes, Delete } = require('./SubAdminAccessController');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/create', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Create(request);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 422);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.post('/subadmin/login', async (request, response) => {
    try {
        let { error, message, data } = await Login(request);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 422);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.get('/list', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await List(request);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 422);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.get('/details', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Details(request);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 422);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.delete('/deletes', VerifyToken, async (req, res) => {
    try {
        let { error, message, data } = await Deletes(request);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 422);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.delete('/delete', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Delete(request);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 422);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.patch('/update', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Update(request);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 422);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

module.exports = Router;
