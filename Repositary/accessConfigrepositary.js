const AccessConfigModel = require('../Models/AccessConfigModel');
const Dotenv = require('dotenv');
Dotenv.config({ path: 'Source/.env.production' });
const { isEmpty } = require('../Helpers/Utils');

const AccessConfigQuery = {
    /***
     * create access_config
     * @param queryOptions
     * @returns {Promise<queryOptions>}
     */
    createAccessConfig: async (queryOptions) => {
        let document = queryOptions ?? {};
        let options = queryOptions ?? {};
        let accessConfig = await AccessConfigModel.create([document], options);
        return accessConfig[0];
    },
    /**
     * find value
     * @param {*} condition
     * @param {*} projection
     * @param {*} useLean
     * @returns
     */
    findOneAccessConfig: async (condition, projection) => {
        if (isEmpty(projection)) projection = {};
        let AccessConfigData = await AccessConfigModel.findOne(condition, projection);
        return AccessConfigData;
        // return await AccessConfigModel.findOne(condition, projection);
    },
    /**
     * find access_config
     * @param {*} condition
     * @param {*} projection
     * @param {*} islean
     * @returns
     */
    findAccessConfig: async (condition, projection, islean = true) => {
        let accessConfig = await AccessConfigModel.find(condition, projection).lean(islean);
        return accessConfig;
    },
    /**
     * update access_config
     * @param {*} condition
     * @param {*} projection
     * @returns
     */
    updateAccessConfig: async (condition, projection) => {
        if (isEmpty(projection)) projection = { new: true };
        return await AccessConfigModel.findOneAndUpdate(condition, projection);
    },
    /**
     * delete value
     * @param {*} condition
     * @returns
     */
    deleteAccessConfig: async (condition) => {
        let options = condition || {};
        return await AccessConfigModel.deleteOne(condition, options);
    }
};

module.exports = AccessConfigQuery;
