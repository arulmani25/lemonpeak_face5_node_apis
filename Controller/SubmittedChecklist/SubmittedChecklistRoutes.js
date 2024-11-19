const Express = require('express');
const Router = Express.Router();
const { Create, List, Submittedjob, Update, Delete } = require('./SubmittedChecklistController');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/submit', VerifyToken, async (request, response) => {
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

Router.patch('/update/:id', VerifyToken, async (request, response) => {
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

Router.delete('/delete/:id', VerifyToken, async (request, response) => {
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

Router.get('/completed_job', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Submittedjob(request);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 422);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

module.exports = Router;
