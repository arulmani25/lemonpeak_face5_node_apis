const Express = require('express');
const Router = Express.Router();
const { Create, Getlaststatus, List, EmpList } = require('./AttendanceController');
const { VerifyToken } = require('../../Helpers/JWSToken');
const { createValidation } = require('./AttendanceValidation');

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

Router.get('/getlaststatus', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Getlaststatus(request?.query);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.post('/list', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await List(request?.body);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.post('/emplist', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await EmpList(request?.body);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

module.exports = Router;
