const UserTypeModel = require('../Models/UserTypeModel');
const Dotenv = require('dotenv');
Dotenv.config({ path: 'Source/.env.production' });
const { isEmpty } = require('../Helpers/Utils');

const UserTypeQuery = {
    /***
     * create user_type
     * @param queryOptions
     * @returns {Promise<queryOptions>}
     */
    createUserType: async (queryOptions) => {
        let document = queryOptions ?? {};
        let options = queryOptions ?? {};
        let complaint = await UserTypeModel.create([document], options);
        return complaint[0];
    },
    /**
     * find value
     * @param {*} condition
     * @param {*} projection
     * @param {*} useLean
     * @returns
     */
    findOneUserType: async (condition, projection) => {
        if (isEmpty(projection)) projection = {};
        let UserData = await UserTypeModel.findOne(condition, projection);
        return UserData;
        // return await UserTypeModel.findOne(condition, projection);
    },
    /**
     * find usertype
     * @param {*} condition
     * @param {*} projection
     * @param {*} islean
     * @returns
     */
    findUserType: async (condition, projection, islean = true) => {
        let user = await UserTypeModel.find(condition, projection).lean(islean);
        return user;
    },
    /**
     * update equipmenttype
     * @param {*} condition
     * @param {*} projection
     * @returns
     */
    updateUserType: async (condition, projection) => {
        if (isEmpty(projection)) projection = { new: true };
        return await UserTypeModel.findOneAndUpdate(condition, projection);
    },
    /**
     * delete value
     * @param {*} condition
     * @returns
     */
    deleteUserType: async (condition) => {
        let options = condition || {};
        return await UserTypeModel.deleteOne(condition, options);
    }
};

module.exports = UserTypeQuery;
