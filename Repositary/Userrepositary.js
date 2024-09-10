const UserModel = require('../Models/UserModel');
const Dotenv = require('dotenv');
Dotenv.config({ path: 'Source/.env.production' });
const { isEmpty } = require('../Helpers/Utils');

const UaerQuery = {
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
    }
};

module.exports = UaerQuery;
