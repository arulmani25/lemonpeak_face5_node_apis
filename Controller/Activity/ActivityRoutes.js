const Express = require('express');
const Router = Express.Router();
const { Create, List, Details, Update, Delete } = require('./ActivityControllers');
const { isEmpty } = require('../../Helpers/Utils');
const { VerifyToken, GenerateToken } = require('../../Helpers/JWSToken');
const { sendFailureMessage, sendSuccessData } = require('../../App/Responder');
const { validationResult } = require('express-validator');
const { createValidation, updateStatusValidation, detailValidation } = require('./ActivityValidation');

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

Router.get('/activity/list/:activityId?', VerifyToken, async (request, response) => {
    try {
        let hasErrors = validationResult(request);
        if (hasErrors.isEmpty()) {
            let { error, message, data } = await List(request?.query, request?.params?.activityId);
            if (!isEmpty(data) && error === false) {
                return sendSuccessData(response, message, data);
            }
        } else {
            return sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.get('/activity/detail/:activityId?', VerifyToken, async (request, response) => {
    try {
        console.log(request?.params?.activityId);
        let { error, message, data } = await Details(request?.params?.activityId);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.patch('/activity/updateActivities', VerifyToken, async (request, response) => {
    try {
        let hasError = validationResult(request);
        if (hasError.isEmpty()) {
            let { error, message, data } = await Update(request?.body);
            if (!isEmpty(data) && error === false) {
                return sendSuccessData(response, message, data);
            }
        } else {
            return sendFailureMessage(response, hasError?.errors[0]?.msg, 422);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.delete('/activity/delete/:activityId', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Delete(request.params.activityId);
        if (error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

module.exports = Router;