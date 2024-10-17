const Express = require('express');
const Router = Express.Router();
const { VerifyToken } = require('../../Helpers/JWSToken');
const { createValidation } = require('./AccessConfigValidation');
const { Create, ListByRole, List, Details, Update, Delete } = require('./AccessConfigController');

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
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.get('/listbyrole', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await ListByRole(request?.loggedUser);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.get('/list/:accessConfigId?', async (request, response) => {
    try {
        let { error, message, data } = await List(request?.query, request?.params?.accessConfigId);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.get('details/:accessConfigId?', async (request, response) => {
    try {
        let { error, message, data } = await Details(request?.params?.accessConfigId);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.patch('/update/:accessConfigId', async (request, response) => {
    try {
        let { error, message, data } = await Update(request?.body);
        if (!isEmpty(data) && error === false) {
            return sendSuccessMessage(response, message);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.delete('/delete/:accessConfigId', async (request, response) => {
    try {
        let { error, message, data } = await Delete(request.params.accessConfigId);
        if (error === false) {
            return sendSuccessMessage(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

module.exports = Router;
