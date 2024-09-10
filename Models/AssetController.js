const express = require('express');
const Router = express.Router();
const { VerifyToken } = require('../Helpers/JWSToken');
const { isEmpty, getNanoId, dateFinder } = require('../Helpers/Utils');
const { validationResult } = require('express-validator');
const moment = require('moment');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const AssetModel = require('../Models/AssetModel');
const { createAsset, findAsset, findOneAsset, updateAsset, deleteAsset } = require('../Repositary/assetrpositary');

Router.post('/create', VerifyToken, async (request, response) => {
    try {
        let hasErrors = validationResult(request);
        if (!hasErrors.isEmpty()) {
            return response.send({
                error: true,
                message: hasErrors?.errors[0]?.msg
            });
        }
        let requestData = request?.body;

        let RequestObject = {
            asset_id: getNanoId(),
            asset_tag: requestData?.asset_tag,
            title: requestData?.title,
            status: requestData?.status,
            type: request?.type,
            address: {
                location: {
                    line_1: requestData?.location?.line_1,
                    line_2: requestData?.location?.line_2,
                    city: requestData?.location?.city,
                    state: requestData?.location?.state,
                    country: requestData?.location?.country,
                    zipcode: requestData?.location?.zipcode
                },
                sub_location: {
                    line_1: requestData?.sub_location?.line_1,
                    line_2: requestData?.sub_location?.line_2,
                    city: requestData?.sub_location?.city,
                    state: requestData?.sub_location?.state,
                    country: requestData?.sub_location?.country,
                    zipcode: requestData?.sub_location?.zipcode
                }
            },
            is_active: requestData?.is_active,
            qrcode: ''
        };
        let Asset = await createAsset(RequestObject);
        if (!Asset) {
            return response.send({
                error: true,
                message: 'Asset create is failure',
                data: {}
            });
        }
        return response.send({
            error: false,
            message: 'Asset created successfully',
            data: Asset
        });
    } catch (error) {
        return response.send({
            error: true,
            message: error.Message,
            data: {}
        });
    }
});

Router.get('/list/:complaintId?', VerifyToken, async (request, response) => {
    try {
        let query = request?.query;
        let complaint_id = request?.params?.complaintId;
        let queryObject = {};
        let limit = query?.limit ? Number.parseInt(query?.limit) : 20;
        let page = query?.page ? Number.parseInt(query?.page) : 1;

        if (query?.complaint_id) queryObject['complaint_id'] = query?.complaint_id;
        if (query?.status) queryObject['status'] = query?.status;
        if (query?.user_role) queryObject['description.user_role'] = query?.user_role;
        if (query?.from_date || query?.to_date || query.date_option) {
            queryObject['createdAt'] = dateFinder(query);
        }
        if (complaint_id) {
            queryObject['complaint_id'] = complaint_id;
        }
        let projection = {
            _id: 0,
            __v: 0
        };
        let complaintData = await AssetModel.find(queryObject, projection)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ _id: -1 })
            .lean();
        if (isEmpty(complaintData)) {
            return response.send({
                error: true,
                message: 'Complaint list is not found',
                data: undefined
            });
        }
        return response.send({
            error: false,
            message: 'Complaint list',
            data: complaintData
        });
    } catch (error) {
        return response.send({
            error: true,
            message: error.message,
            data: undefined
        });
    }
});

Router.get('/details/:complaintId?', VerifyToken, async (request, response) => {
    let queryData = request?.params?.complaintId;
    if (isEmpty(queryData)) {
        return response.send({
            error: true,
            message: 'complaint_id is not empty',
            data: undefined
        });
    }
    let projection = {
        _id: 0,
        __v: 0
    };
    let result = await findOneAsset({ complaint_id: queryData }, projection);
    try {
        if (isEmpty(result)) {
            return response.send({
                error: true,
                message: 'complaint details is not found',
                data: undefined
            });
        } else {
            return response.send({
                error: false,
                message: 'Complaint details are.',
                data: result
            });
        }
    } catch (error) {
        return response.send({
            error: true,
            message: error.message
        });
    }
});

Router.patch('/update', VerifyToken, async (request, response) => {
    try {
        let RequestData = request?.body;
        if (isEmpty(RequestData)) {
            return response.send({
                error: true,
                message: 'request value is not empty',
                data: undefined
            });
        }
        let complaint = await updateAsset({ complaint_id: RequestData?.complaint_id });
        if (isEmpty(complaint)) {
            return response.send({
                error: true,
                message: 'complaint is not available'
            });
        } else {
            complaint.description.complaint = RequestData?.complaint ?? complaint?.description?.complaint;
            complaint.status = RequestData?.status ?? complaint?.status;
            complaint.markModified(['description.compliant', 'status']);

            let result = await complaint.save();
            if (!isEmpty(result)) {
                return response.send({
                    error: false,
                    message: 'compliant update successfully!!'
                });
            }
            return response.send({
                error: false,
                message: 'Something went wrong!'
            });
        }
    } catch (error) {
        return response.send({
            error: true,
            message: error.message
        });
    }
});

Router.delete('/delete/:complaintId?', VerifyToken, async (request, response) => {
    try {
        let queryData = request?.params?.complaintId;
        if (isEmpty(queryData)) {
            return response.send({
                error: true,
                message: 'complaint_id is not empty',
                data: undefined
            });
        }
        let complaint = await findOneComplaint({ complaint_id: queryData });
        if (isEmpty(complaint)) {
            return response.send({
                error: true,
                message: 'complaint is not available'
            });
        } else {
            let result = await deleteComplaint(complaint);
            if (result.acknowledged === true) {
                return response.send({
                    error: false,
                    message: 'complaint deleted successfully!'
                });
            }
            return response.send({
                error: true,
                message: 'Something went wrong!'
            });
        }
    } catch (error) {
        return response.send({
            error: true,
            message: error.message
        });
    }
});

Router.post('/generatepdf', VerifyToken, async (request, response) => {
    try {
        let RequestData = request?.query;
        if (isEmpty(RequestData)) {
            return response.send({
                error: true,
                message: 'user_id is not empty',
                data: undefined
            });
        }
        let projection = {
            _id: 0,
            __v: 0
        };
        let complaint = await findComplaint({ complaint_no: RequestData?.complaint_no }, projection);

        if (isEmpty(complaint)) {
            return response.send({
                error: true,
                message: 'complaint is not available'
            });
        }
        let project = {
            __v: 0,
            fcm_token: 0,
            updatedAt: 0,
            createdAt: 0,
            projection: 0,
            password: 0
        };
        let getUser = await findOneUser(
            {
                _id: new ObjectId(complaint.at(-1).description.user_id)
            },
            project
        );

        let result = await complaintPdf(complaint, getUser, RequestData?.complaint_no);
        console.log('result', result);
        return;
    } catch (error) {}
});

module.exports = Router;
