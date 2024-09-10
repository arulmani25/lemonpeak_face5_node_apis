const ComplaintModel = require('../Models/ComplaintModel');
const Dotenv = require('dotenv');
Dotenv.config({ path: 'Source/.env.production' });
const { isEmpty } = require('../Helpers/Utils');

const ComplaintQuery = {
    /***
     * create complaint
     * @param queryOptions
     * @returns {Promise<queryOptions>}
     */
    createComplaint: async (queryOptions) => {
        let document = queryOptions ?? {};
        let options = queryOptions ?? {};
        let complaint = await ComplaintModel.create([document], options);
        return complaint[0];
    },
    /**
     * find value
     * @param {*} condition
     * @param {*} projection
     * @param {*} useLean
     * @returns
     */
    findOneComplaint: async (condition, projection) => {
        if (isEmpty(projection)) projection = {};
        let ComplaintData = await ComplaintModel.findOne(condition, projection);
        return ComplaintData;
    },
    /**
     * find complaint
     * @param {*} condition
     * @param {*} projection
     * @param {*} islean
     * @returns
     */
    findComplaint: async (condition, projection, islean = true) => {
        let complaint = await ComplaintModel.find(condition, projection).lean(islean);
        return complaint;
    },
    /**
     * update complaint
     * @param {*} condition
     * @param {*} projection
     * @returns
     */
    updateComplaint: async (condition, projection) => {
        if (isEmpty(projection)) projection = { new: true };
        return await ComplaintModel.findOneAndUpdate(condition, projection);
    },
    /**
     * delete value
     * @param {*} condition
     * @returns
     */
    deleteComplaiint: async (condition) => {
        let options = condition || {};
        return await ComplaintModel.deleteOne(condition, options);
    }
};

module.exports = ComplaintQuery;
