const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const User = require('../../Models/UserModel');
const UserType = require('../../Models/UserTypeModel');
const {
    createUserType,
    findOneUserType,
    updateUserType,
    deleteUserType
} = require('../../Repositary/UserTyperepositary');
const { isEmpty } = require('../../Helpers/Utils');

const UserTypeController = {
    /**
     * create user_type
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Create: async (requearData) => {
        try {
            if (!requearData?.name || !requearData?.code) {
                return {
                    error: 'Failed',
                    message: 'Name and code are required fields',
                    data: {}
                };
            }
            const existingType = await findOneUserType({ code: requearData?.code });
            if (existingType) {
                return {
                    error: 'Failed',
                    message: 'duplicate user_type found. Please choose a unique user_type.',
                    data: {}
                };
            }

            const newUserType = await createUserType(requearData);
            return {
                error: false,
                message: 'user_type created successfully',
                data: newUserType
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
     * list of user_type
     * @param {*} query
     * @param {*} UserTypeID
     * @returns
     */
    List: async (query, UserTypeID) => {
        try {
            let queryObject = {};
            let limit = query?.limit ? Number.parseInt(query?.limit) : 20;
            let page = query?.page ? Number.parseInt(query?.page) : 1;

            if (query?.user_type_id) queryObject['user_type_id'] = query?.user_type_id;
            if (query?.name) queryObject['name'] = query?.name;
            if (query?.code) queryObject['code'] = query?.code;
            if (query?.from_date || query?.to_date || query.date_option) {
                queryObject['createdAt'] = dateFinder(query);
            }
            if (UserTypeID) {
                queryObject['user_type_id'] = UserTypeID;
            }
            let projection = {
                _id: 0,
                __v: 0
            };
            let userTypeData = await UserType.find(queryObject, projection)
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ _id: -1 })
                .lean();
            if (isEmpty(userTypeData)) {
                return {
                    error: true,
                    message: 'user_type list is not found',
                    data: undefined
                };
            }
            return {
                error: false,
                message: 'user_type list',
                data: userTypeData
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
     * details of usertype
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Details: async (user_type_id) => {
        try {
            if (isEmpty(user_type_id)) {
                return {
                    error: true,
                    message: 'user_type_id is not empty',
                    data: undefined
                };
            }
            let projection = {
                _id: 0,
                __v: 0
            };
            let result = await findOneUserType({ user_type_id: user_type_id }, projection);
            if (isEmpty(result)) {
                return {
                    error: true,
                    message: 'user_type details is not found',
                    data: undefined
                };
            } else {
                return {
                    error: false,
                    message: 'user_type details are.',
                    data: result
                };
            }
        } catch (error) {
            return {
                error: true,
                message: error.message,
                data: {}
            };
        }
    },
    /**
     * update usertype
     * @param {*} requestData
     * @returns
     */
    Update: async (requestData) => {
        try {
            if (isEmpty(requestData)) {
                return {
                    error: true,
                    message: 'input value is not empty',
                    data: undefined
                };
            }
            const getUserType = await findOneUserType({ user_type_id: requestData?.user_type_id });
            if (!getUserType) {
                return {
                    error: true,
                    message: 'user_type not found',
                    debuggerata: {}
                };
            }

            getUserType.name = requestData?.name ?? getUserType?.name;
            getUserType.code = requestData?.code ?? getUserType?.code;
            getUserType.description = requestData?.description ?? getUserType?.description;

            getUserType.markModified(['name', 'code', 'description']);
            const updatedUserType = await getUserType.save();
            return {
                error: false,
                message: 'user_type updated successfully',
                debuggerata: updatedUserType
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
     * delete usertype
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Delete: async (user_type_id) => {
        try {
            if (isEmpty(user_type_id)) {
                return {
                    error: true,
                    message: 'user_type_id is not empty',
                    data: undefined
                };
            }
            let UserType = await findOneUserType({ user_type_id: user_type_id });
            if (isEmpty(UserType)) {
                return {
                    error: true,
                    message: 'user_type is not found',
                    data: {}
                };
            } else {
                let result = await deleteUserType({ user_type_id: UserType?.user_type_id });
                if (result.acknowledged === true && result.deletedCount > 0) {
                    return {
                        error: false,
                        message: 'user_type deleted successfully!',
                        data: {}
                    };
                }
                return {
                    error: true,
                    message: 'Failed to delete user_type',
                    data: {}
                };
            }
        } catch (error) {
            return {
                error: true,
                message: error.message,
                data: {}
            };
        }
    }
};

module.exports = UserTypeController;
