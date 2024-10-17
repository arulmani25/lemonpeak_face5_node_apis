const Express = require('express');
const Router = Express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const AccessConfigModel = require('../../Models/AccessConfigModel');
const { isEmpty, getNanoId } = require('../../Helpers/Utils');
const {
    createAccessConfig,
    findOneAccessConfig,
    updateAccessConfig,
    deleteAccessConfig
} = require('../../Repositary/accessConfigrepositary');
const { findOneUserType } = require('../../Repositary/UserTyperepositary');

const AccessConfiguration = {
    /**
     * create access_config
     * @param {*} requestData
     * @returns
     */
    Create: async (requestData) => {
        try {
            const existingAccess = await findOneAccessConfig({ role: requestData?.user_type_id });
            if (isEmpty(existingAccess)) {
                return {
                    error: true,
                    message: 'Role Configuration already exists',
                    data: {}
                };
            }
            let requestObject = {
                access_config_id: getNanoId(),
                access_config: requestData?.access_config,
                user_type_id: requestData?.user_type_id ?? '',
                sideBar: requestData?.sideBar ?? []
            };
            const newAccess = await createAccessConfig(requestObject);
            const getRole = await findOneUserType(requestData?.user_type_id);
            return {
                error: false,
                message: `Acces configuration for the role ${getRole?.name} created successfully`,
                data: newAccess
            };
        } catch (error) {
            return {
                error: true,
                message: error?.message,
                Data: undefined
            };
        }
    },
    /**
     * get role
     * @param {*} loggedUser
     * @returns
     */
    ListByRole: async (loggedUser) => {
        try {
            const getIdByRole = await findOneUserType({ name: loggedUser?.user_type });
            if (isEmpty(getIdByRole)) {
                return {
                    error: true,
                    message: 'user_type is not found',
                    data: {}
                };
            }
            const getConfigs = await findOneAccessConfig({ role: getIdByRole?.user_type_id });
            if (isEmpty(getConfigs)) {
                return {
                    error: true,
                    message: 'Access_Configuration is not found',
                    data: {}
                };
            }
            return {
                error: false,
                moduleessage: 'Access Configuration Retrieved Successfully',
                data: getConfigs
            };
        } catch (error) {
            return {
                error: true,
                message: error?.message,
                data: {}
            };
        }
    },
    /**
     * get access_config list
     * @param {*} query
     * @param {*} access_config_id
     * @returns
     */
    List: async (query, access_config_id) => {
        try {
            let queryObject = {};
            let limit = query?.limit ? Number.parseInt(query?.limit) : 20;
            let page = query?.page ? Number.parseInt(query?.page) : 1;

            if (query?.access_config_id) queryObject['access_config_id'] = query?.access_config_id;
            if (query?.access_config) queryObject['access_config'] = query?.access_config;
            if (query?.user_type_id) queryObject['user_type_id'] = query?.user_type_id;
            if (query?.from_date || query?.to_date || query.date_option) {
                queryObject['createdAt'] = dateFinder(query);
            }
            if (access_config_id) {
                queryObject['access_config_id'] = access_config_id;
            }
            let projection = {
                _id: 0,
                __v: 0
            };
            let AccessConfigData = await AccessConfigModel.find(queryObject, projection)
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ _id: -1 })
                .lean();
            if (isEmpty(AccessConfigData)) {
                return {
                    error: true,
                    message: 'AccessConfig list is not found',
                    data: undefined
                };
            }
            return {
                error: false,
                message: 'AccessConfig list',
                data: AccessConfigData
            };
        } catch (error) {
            return {
                error: true,
                message: error.message,
                data: undefined
            };
        }
    },
    /**
     * details
     * @param {*} accessConfigId
     * @returns
     */
    Details: async (accessConfigId) => {
        try {
            const accessConfig = await findOneAccessConfig({ access_config_id: accessConfigId });
            if (!accessConfig) {
                return {
                    error: true,
                    message: 'Access config not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'Access Configuration retrieved successfully',
                data: accessConfig
            };
        } catch (error) {
            return {
                error: true,
                message: error,
                message,
                data: {}
            };
        }
    },
    /**
     * update access_config details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Update: async (requestData) => {
        try {
            const updatedAccess = await AccessConfig.findByIdAndUpdate(
                requestData?.params?.accessConfigId,
                requestData?.body,
                { new: true }
            );
            if (!updatedAccess) {
                return {
                    error: true,
                    message: 'Access Config not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'Access Configuration updated successfully',
                data: updatedAccess
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
     * delete access config details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Delete: async (requestData) => {
        try {
            const deletedConfig = await AccessConfig.findByIdAndDelete(requestData?.params?.accessConfigId);
            if (!deletedConfig) {
                return {
                    error: true,
                    message: 'Access Configuration not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'Access Configuration deleted successfully',
                data: deletedConfig
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

module.exports = AccessConfiguration;
