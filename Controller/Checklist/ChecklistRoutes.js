const Express = require('express');
const Router = Express.Router();
const { Create, List, Details, Update, Delete } = require('./ChecklistController');
const { createValidation } = require('./ChecklistValidation');
const { VerifyToken } = require('../../Helpers/JWSToken');

Router.post('/create', VerifyToken, createValidation(), async (request, response) => {
    try {
        let hasErrors = validationResult(request);
        if (hasErrors.isEmpty()) {
            let { error, message, data } = await Create(request?.body);
            if (!isEmpty(data) && error === false) {
                return sendSuccessData(response, message, data);
            }
            return sendFailureMessage(response, message, 422);
        } else {
            return sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
        }
    } catch (error) {
        console.log(error);
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.get('/list', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await List(request);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.get('/details/:checklistID?', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Details(request?.params?.checklistID);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.post('/updatechecklist/:id', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Update(request?.params?.checklistID);
        if (error === false) {
            return sendSuccessMessage(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.delete('/delete/:checklistID?', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Delete(request?.params?.checklistID);
        if (error === false) {
            return sendSuccessMessage(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

module.exports = Router;
