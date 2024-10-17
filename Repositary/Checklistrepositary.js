const ChecklistModel = require('../Models/ChecklistModel');
const Dotenv = require('dotenv');
Dotenv.config({ path: 'Source/.env.production' });
const { isEmpty } = require('../Helpers/Utils');

const ChecklistQuery = {
    /***
     * create checklist
     * @param queryOptions
     * @returns {Promise<queryOptions>}
     */
    createChecklist: async (queryOptions) => {
        let document = queryOptions ?? {};
        let options = queryOptions ?? {};
        let checklist = await ChecklistModel.create([document], options);
        return checklist[0];
    },
    /**
     * find value
     * @param {*} condition
     * @param {*} projection
     * @param {*} useLean
     * @returns
     */
    findOneChecklist: async (condition, projection) => {
        if (isEmpty(projection)) projection = {};
        let ChecklistData = await ChecklistModel.findOne(condition, projection);
        return ChecklistData;
        // return await ChecklistModel.findOne(condition, projection);
    },
    /**
     * find checklist
     * @param {*} condition
     * @param {*} projection
     * @param {*} islean
     * @returns
     */
    findChecklist: async (condition, projection, islean = true) => {
        let checklist = await ChecklistModel.find(condition, projection).lean(islean);
        return checklist;
    },
    /**
     * update checklist
     * @param {*} condition
     * @param {*} projection
     * @returns
     */
    updateChecklist: async (condition, projection) => {
        if (isEmpty(projection)) projection = { new: true };
        return await ChecklistModel.findOneAndUpdate(condition, projection);
    },
    /**
     * delete value
     * @param {*} condition
     * @returns
     */
    deleteChecklist: async (condition) => {
        let options = condition || {};
        return await ChecklistModel.deleteOne(condition, options);
    }
};

module.exports = ChecklistQuery;
