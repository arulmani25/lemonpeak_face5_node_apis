const Express = require('express');
const Router = Express.Router();
const bodyParser = require('body-parser');
const { getNanoId, isEmpty } = require('../../Helpers/Utils');
Router.use(bodyParser.urlencoded({ extended: false }));
const ClientManagementModel = require('../../Models/ClientManagementModel');
const {
    createClientManagement,
    findOneClientManagement,
    deleteClientManagement
} = require('../../Repositary/clientManagementrepositary');

const ClientManagement = {
    /**
     * create client
     * @param {*} requestData
     * @returns
     */
    Create: async (requestData) => {
        try {
            if (!requestData?.email) {
                return {
                    error: true,
                    message: 'Email is required field',
                    data: {}
                };
            }
            let requestObject = {
                client_id: getNanoId(),
                firstName: requestData?.firstName ?? '',
                lastName: requestData?.lastName ?? '',
                email: requestData?.email ?? '',
                site_id: requestData?.site_id ?? '',
                address: {
                    fullAddress: requestData?.address?.fullAddress ?? '',
                    street: requestData?.address?.street ?? '',
                    city: requestData?.address?.city ?? '',
                    state: requestData?.address?.state ?? '',
                    postalCode: requestData?.address?.postalCode ?? '',
                    country: requestData?.address?.country ?? '',
                    lng: requestData?.address?.lng ?? '',
                    lat: requestData?.address?.lat ?? ''
                },
                phoneNumber: requestData?.phoneNumber ?? '',
                countryCode: requestData?.countryCode ?? '',
                gender: requestData?.gender ?? '',
                profileImage: requestData?.profileImage ?? '',
                accountNumber: requestData?.accountNumber ?? 0,
                GSTIN: requestData?.GSTIN ?? '',
                legalName: requestData?.legalName ?? '',
                aadhar: requestData?.aadhar ?? 0,
                panCard: requestData?.panCard ?? '',
                bankMedia: requestData?.bankMedia ?? '',
                panCardMedia: requestData?.panCardMedia ?? '',
                gstMedia: requestData?.gstMedia ?? ''
            };
            const newClient = await createClientManagement(requestObject);
            return {
                error: false,
                message: 'Client created successfully',
                data: newClient
            };
        } catch (error) {
            return {
                error: true,
                message: error.message,
                data: {}
            };
        }
    },
    /**
     * list of client
     * @param {*} req
     * @param {*} res
     * @returns
     */
    List: async (request) => {
        try {
            const { searchKey, skip, limit, sortkey, sortOrder, status } = request?.query;

            const sort = {
                [sortkey ? sortkey : 'createdAt']: !sortOrder || sortOrder === 'DESC' ? -1 : 1
            };

            const clientList = await ClientManagementModel.aggregate([
                {
                    $match: status ? { status: status } : {}
                },
                {
                    $match: searchKey
                        ? {
                              $or: [{}]
                          }
                        : {}
                },
                {
                    $sort: sort
                },
                {
                    $facet: {
                        pagination: [{ $count: 'totalCount' }],
                        data: [{ $skip: Number(skip) || 0 }, { $limit: Number(limit) || 10 }]
                    }
                }
            ]);
            return {
                error: false,
                message: 'Clients retrieved successfully',
                data: clientList
            };
        } catch (error) {
            return {
                error: true,
                message: error.message,
                data: {}
            };
        }
    },
    /**
     * client details
     * @param {*} clientId
     * @returns
     */
    Details: async (clientId) => {
        try {
            const getClient = await findOneClientManagement({ client_id: clientId });
            if (isEmpty(getClient)) {
                return {
                    error: true,
                    message: 'Client not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'Client retrieved successfully',
                data: getClient
            };
        } catch (error) {
            return {
                error: true,
                message: 'Internal Server Error',
                data: {}
            };
        }
    },
    /**
     * update client
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Update: async (request) => {
        try {
            if (isEmpty(request?.client_id)) {
                return {
                    error: true,
                    message: 'Client_id is not empty',
                    data: {}
                };
            }
            let getClient = await findOneClientManagement({ client_id: request?.client_id });
            if (isEmpty(getClient)) {
                return {
                    error: true,
                    message: 'client is not found',
                    data: {}
                };
            }
            getClient.firstName = request?.firstName ?? getClient?.firstName;
            getClient.lastName = request?.lastName ?? getClient?.lastName;
            getClient.email = request?.email ?? getClient?.email;
            getClient.address.fullAddress = request?.address?.fullAddress ?? getClient?.address?.fullAddress;
            getClient.address.street = request?.address?.street ?? getClient?.address?.street;
            getClient.address.city = request?.address?.city ?? getClient?.address?.city;
            getClient.address.state = request?.address?.state ?? getClient?.address?.state;
            getClient.address.postalCode = request?.address?.postalCode ?? getClient?.address?.postalCode;
            getClient.address.country = request?.address?.country ?? getClient?.address?.country;

            getClient.markModified([
                'firstName',
                'lastName',
                'email',
                'address.fullAddress',
                'address.street',
                'address.city',
                'address.state',
                'address.postalCode',
                'address.country'
            ]);
            let result = await getClient.save();
            if (!result) {
                return {
                    error: true,
                    message: 'Client is not updated',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'Client updated successfully',
                data: result
            };
        } catch (error) {
            return {
                error: true,
                message: error.message,
                data: {}
            };
        }
    },
    /**
     * update client details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    UpdateStatus: async (req, res) => {
        try {
            // Basic input validation
            const clientStatus = await ClientManagementModel.findById(req.params.id);
            if (!clientStatus) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'Client not found',
                    Data: {},
                    Code: 404
                });
            }

            const clientStatusUpdate = await ClientManagementModel.findOneAndUpdate(
                { _id: req.params.id },
                { $set: { status: req.body.status } }
            );

            return res.json({
                Status: 'Success',
                Message: 'Client Status updated successfully',
                Data: {},
                Code: 200
            });
        } catch (error) {
            return res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    },
    /**
     * linksite
     * @param {*} req
     * @param {*} res
     * @returns
     */
    LinkSite: async (req, res) => {
        try {
            // Basic input validation
            const getclient = await ClientManagementModel.findById(req.params.id);
            if (!getclient) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'Client not found',
                    Data: {},
                    Code: 404
                });
            }

            const clientSiteLink = await ClientManagementModel.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { siteDetails: req.body.siteId } }
            );

            return res.json({
                Status: 'Success',
                Message: 'Client Site Linked successfully',
                Data: {},
                Code: 200
            });
        } catch (error) {
            return res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    },
    /**
     * unlink site
     * @param {*} req
     * @param {*} res
     * @returns
     */
    UnlinkSite: async (req, res) => {
        try {
            // Basic input validation
            const getclient = await ClientManagementModel.findById(req.params.id);
            if (!getclient) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'Client not found',
                    Data: {},
                    Code: 404
                });
            }

            const clientSiteUnLink = await ClientManagementModel.findOneAndUpdate(
                { _id: req.params.id },
                { $pull: { siteDetails: req.body.siteId } }
            );

            return res.json({
                Status: 'Success',
                Message: 'Client Site UnLinked successfully',
                Data: {},
                Code: 200
            });
        } catch (error) {
            return res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    },
    /**
     * delete client
     * @param {*} clientId
     * @returns
     */
    Delete: async (clientId) => {
        try {
            const removeClient = await deleteClientManagement({ client_id: clientId });
            if (!removeClient) {
                return {
                    error: true,
                    message: 'Client not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'Client deleted successfully',
                data: {}
            };
        } catch (error) {
            return {
                error: true,
                message: error.message,
                data: {}
            };
        }
    }
};

module.exports = ClientManagement;
