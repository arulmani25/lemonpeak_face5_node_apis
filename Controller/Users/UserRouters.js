const Express = require('express');
const Router = Express.Router();
const { Create, List, Details, Update, Delete, Login, UpdatePassword, ForgotPassword } = require('./UserController');
const { VerifyToken } = require('../../Helpers/JWSToken');
const { isEmpty } = require('../../Helpers/Utils');
const { validationResult } = require('express-validator');
const { createValidation, updateValidation } = require('./UserValidation');
const { sendSuccessData, sendSuccessMessage, sendFailureMessage } = require('../../App/Responder');

Router.post('/create', createValidation(), async (request, response) => {
    try {
        let hasErrors = validationResult(request, response);
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

Router.get('/list', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await List(request?.query, request?.params?.userID);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error, 500);
    }
});

Router.get('/details/:userId', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Details(request?.params?.userId);
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
                return sendSuccessMessage(response, message, data);
            }
        } else {
            return sendFailureMessage(response, hasError?.errors[0]?.msg, 422);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error, 500);
    }
});

Router.delete('/delete/:id', VerifyToken, async (request, response) => {
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

Router.post('/login/:fcm', async (request, response) => {
    try {
        let { error, message, data } = await Login(request?.body, request?.params?.fcm);
        console.log(error, message, data);
        console.log(!isEmpty(data) && error === false);
        if (!isEmpty(data) && error === false) {
            console.log(data, message, error);
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error, 500);
    }
});

Router.post('/updatepassword', VerifyToken, (req, res) => {
    return UpdatePassword(req, res);
});

Router.post('/forgotpassword', (req, res) => {
    return ForgotPassword(req, res);
});

module.exports = Router;
