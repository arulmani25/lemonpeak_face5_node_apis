const UserModel = require('../Models/UserModel');
const Dotenv = require('dotenv');
Dotenv.config({ path: 'Source/.env.production' });
const { isEmpty } = require('../Helpers/Utils');

const UaerQuery = {
    /***
     * create user
     * @param queryOptions
     * @returns {Promise<queryOptions>}
     */
    createUser: async (queryOptions) => {
        let document = queryOptions ?? {};
        let options = queryOptions ?? {};
        let User = await UserModel.create([document], options);
        return User[0];
    },
    /**
     * find value
     * @param {*} condition
     * @param {*} projection
     * @param {*} useLean
     * @returns
     */
    findOneUser: async (condition, projection) => {
        if (isEmpty(projection)) projection = {};
        let UserData = await UserModel.findOne(condition, projection);
        console.log('UserData', UserData);
        return UserData;
        // return await UserModel.findOne(condition, projection);
    },
    /**
     * find user
     * @param {*} condition
     * @param {*} projection
     * @param {*} islean
     * @returns
     */
    findUser: async (condition, projection, islean = true) => {
        let user = await UserModel.find(condition, projection).lean(islean);
        return user;
    },
    /**
     * delete value
     * @param {*} condition
     * @returns
     */
    deleteUser: async (condition) => {
        let options = condition || {};
        return await UserModel.deleteOne(condition, options);
    }
};

module.exports = UaerQuery;
