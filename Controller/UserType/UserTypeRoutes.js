const Express = require('express');
const Router = Express.Router();
const { Create, List, Details, Update, Delete } = require('./UserTypeController');
const { VerifyToken } = require('../../Helpers/JWSToken');
const { createValidation, updateValidation } = require('./UserTypeValidation');
const {isEmpty}= require('../../Helpers/Utils');
const { sendSuccessData, sendFailureMessage, sendSuccessMessage } = require('../../App/Responder');

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
        return sendFailureMessage(response, error, 500);
    }
});

Router.get('/list/:userTypeID?', VerifyToken,async (request, response) => {
    try {
        let { error, message, data } = await List(request?.query, request?.params?.userTypeID);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error, 500);
    }
});

Router.get('/details/:userTypeID', VerifyToken, async (request, response) => {
    try {
        console.log(request?.params?.activityId);
        let { error, message, data } = await Details(request?.params?.userTypeID);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error, 500);
    }
});

Router.patch('/update', VerifyToken, updateValidation(), async (request, response) => {
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
        return sendFailureMessage(response, error, 500);
    }
});

Router.delete('/delete/:userTypeID',VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Delete(request.params.userTypeID);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error, 500);
    }
});

module.exports = Router;
