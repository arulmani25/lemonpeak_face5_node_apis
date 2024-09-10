const AssetModel = require('../Models/AssetModel');
const Dotenv = require('dotenv');
Dotenv.config({ path: 'Source/.env.production' });
const { isEmpty } = require('../Helpers/Utils');

const AssetQuery = {
    /***
     * create asset
     * @param queryOptions
     * @returns {Promise<queryOptions>}
     */
    createAsset: async (queryOptions) => {
        let document = queryOptions ?? {};
        let options = queryOptions ?? {};
        let asset = await AssetModel.create([document], options);
        return asset[0];
    },
    /**
     * find value
     * @param {*} condition
     * @param {*} projection
     * @param {*} useLean
     * @returns
     */
    findOneAsset: async (condition, projection) => {
        if (isEmpty(projection)) projection = {};
        let AssetData = await AssetModel.findOne(condition, projection);
        return AssetData;
        // return await ComplaintModel.findOne(condition, projection);
    },
    /**
     * find asset
     * @param {*} condition
     * @param {*} projection
     * @param {*} islean
     * @returns
     */
    findAsset: async (condition, projection, islean = true) => {
        let asset = await AssetModel.find(condition, projection).lean(islean);
        return asset;
    },
    /**
     * update asset
     * @param {*} condition
     * @param {*} projection
     * @returns
     */
    updateAsset: async (condition, projection) => {
        if (isEmpty(projection)) projection = { new: true };
        return await AssetModel.findOneAndUpdate(condition, projection);
    },
    /**
     * delete value
     * @param {*} condition
     * @returns
     */
    deleteAsset: async (condition) => {
        let options = condition || {};
        return await AssetModel.deleteOne(condition, options);
    }
};

module.exports = AssetQuery;
