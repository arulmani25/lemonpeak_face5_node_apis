const Express = require('express');
const Router = Express.Router();
const { Create, List, Details, Update, Delete } = require('./ActivityControllers');
const { isEmpty } = require('../../Helpers/Utils');
const { VerifyToken } = require('../../Helpers/JWSToken');
const { sendFailureMessage, sendSuccessData, sendSuccessMessage } = require('../../App/Responder');
const { validationResult } = require('express-validator');
const { createValidation, updateValidation, detailValidation } = require('./ActivityValidation');

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

Router.get('/list/:activityId?', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await List(request?.query, request?.params?.activityId);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.get('/details/:activityId?', VerifyToken, detailValidation(), async (request, response) => {
    try {
        let hasError = validationResult(request);
        if (hasError.isEmpty()) {
            let { error, message, data } = await Details(request?.params?.activityId);
            if (!isEmpty(data) && error === false) {
                return sendSuccessData(response, message, data);
            }
            return sendFailureMessage(response, message, 400);
        } else {
            return sendFailureMessage(response, hasError?.errors[0]?.msg, 422);
        }
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.patch('/update', VerifyToken, updateValidation(), async (request, response) => {
    try {
        let hasError = validationResult(request);
        if (hasError.isEmpty()) {
            let { error, message, data } = await Update(request?.body);
            if (!isEmpty(data) && error === false) {
                return sendSuccessMessage(response, message);
            }
            return sendFailureMessage(response, message, 400);
        } else {
            return sendFailureMessage(response, hasError?.errors[0]?.msg, 422);
        }
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.delete('/delete/:activityId', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Delete(request.params.activityId);
        if (error === false) {
            return sendSuccessMessage(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

module.exports = Router;
