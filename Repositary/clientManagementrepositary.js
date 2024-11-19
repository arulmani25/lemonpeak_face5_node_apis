const ClientManagementModel = require('../Models/ClientManagementModel');
const Dotenv = require('dotenv');
Dotenv.config({ path: 'Source/.env.production' });
const { isEmpty } = require('../Helpers/Utils');

const ClientManagementQuery = {
    /***
     * create ClientManagement
     * @param queryOptions
     * @returns {Promise<queryOptions>}
     */
    createClientManagement: async (queryOptions) => {
        let document = queryOptions ?? {};
        let options = queryOptions ?? {};
        let clientmanagement = await ClientManagementModel.create([document], options);
        return clientmanagement[0];
    },
    /**
     * find value
     * @param {*} condition
     * @param {*} projection
     * @param {*} useLean
     * @returns
     */
    findOneClientManagement: async (condition, projection) => {
        if (isEmpty(projection)) projection = {};
        let ClientManagementData = await ClientManagementModel.findOne(condition, projection);
        return ClientManagementData;
        // return await ClientManagementModel.findOne(condition, projection);
    },
    /**
     * find ClientManagement
     * @param {*} condition
     * @param {*} projection
     * @param {*} islean
     * @returns
     */
    findClientManagement: async (condition, projection, islean = true) => {
        let clientmanagement = await ClientManagementModel.find(condition, projection).lean(islean);
        return clientmanagement;
    },
    /**
     * update clientmanagement
     * @param {*} condition
     * @param {*} projection
     * @returns
     */
    updateClientManagement: async (condition, projection) => {
        if (isEmpty(projection)) projection = { new: true };
        return await ClientManagementModel.findOneAndUpdate(condition, projection);
    },
    /**
     * delete value
     * @param {*} condition
     * @returns
     */
    deleteClientManagement: async (condition) => {
        let options = condition || {};
        return await ClientManagementModel.deleteOne(condition, options);
    }
};

module.exports = ClientManagementQuery;
