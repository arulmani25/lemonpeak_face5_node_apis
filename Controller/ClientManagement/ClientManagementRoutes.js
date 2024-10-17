const Express = require('express');
const Router = Express.Router();
const {
    Create,
    List,
    Details,
    Update,
    UpdateStatus,
    LinkSite,
    UnlinkSite,
    Delete
} = require('./ClientManagementController');
const { VerifyToken } = require('../../Helpers/JWSToken');
const { createValidation } = require('./ClientmanagementValidation');

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

Router.get('/details/:clientId', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Details(request?.params?.clientId);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.post('/update', VerifyToken, (req, res) => {
    return Update(req, res);
});

Router.put('/updatestatus/:id', VerifyToken, (req, res) => {
    return UpdateStatus(req, res);
});

Router.put('/linksite/:id', VerifyToken, (req, res) => {
    return LinkSite(req, res);
});

Router.put('/unlinksite/:id', VerifyToken, (req, res) => {
    return UnlinkSite(req, res);
});

Router.delete('/delete/:clientId', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Delete(request?.params?.clientId);
        if (error === false) {
            return sendSuccessMessage(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

module.exports = Router;
