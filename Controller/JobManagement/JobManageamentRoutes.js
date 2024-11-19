const Express = require('express');
const Router = Express.Router();
const {
    Create,
    List,
    Details,
    Update,
    UpdateStatus,
    TrackEmployee,
    Dashboard,
    Graphdata,
    Generatepdf,
    MobileJoblist,
    DeleteJobManagement
} = require('./JobManagementController');
const { VerifyToken } = require('../../Helpers/JWSToken');
const { sendFailureMessage, sendSuccessData, sendSuccessData } = require('../../App/Responder');

Router.post('/create', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Create(request?.body);
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
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.get('/details/:id', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Details(request?.params?.id);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
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
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.patch('/updatestatus/:id', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await UpdateStatus(request);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.get('/employeetracking', async (request, response) => {
    try {
        let { error, message, data } = await TrackEmployee(request);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.get('/dashboard', async (request, response) => {
    try {
        let { error, message, data } = await Dashboard(request);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.delete('/delete/:id', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await DeleteJobManagement(request);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.post('/graph', VerifyToken, async (request, response) => {
    try {
        let { error, message, data } = await Graphdata(request);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.get('/generatepdf', async (req, res) => {
    try {
        let { error, message, data } = await Generatepdf(request);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

Router.get('/mobile/joblist', VerifyToken, async (req, res) => {
    try {
        let { error, message, data } = await MobileJoblist(request);
        if (!isEmpty(data) && error === false) {
            return sendSuccessData(response, message, data);
        }
        return sendFailureMessage(response, message, 400);
    } catch (error) {
        return sendFailureMessage(response, error.message, 500);
    }
});

module.exports = Router;
