const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const subAdminAccessModel = require('../../Models/SubAdminAccessModel');

const SubAdminAccessController = {
    /**
     * create sub_admin
     * @param {*} req
     * @param {*} res
     */
    Create: async function (req, res) {
        const isExist = await subAdminAccessModel.findOne({
            user_name: req.body.user_name
        });
        if (isExist == null) {
            try {
                await subAdminAccessModel.create(
                    {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        status: req.body.status,
                        email: req.body.email,
                        phoneNumber: req.body.phoneNumber,
                        username: req.body.username,
                        password: req.body.password,
                        confirm_password: req.body.confirm_password,
                        access_location: req.body.access_location,
                        isActive: req.body.isActive,
                        last_login: new Date()
                    },
                    function (err, user) {
                        return {
                            error: false,
                            message: 'Sub Admin Access Added successfully',
                            data: user
                        };
                    }
                );
            } catch (error) {
                return {
                    error: true,
                    message: error.message,
                    data: {}
                };
            }
        } else {
            return {
                error: true,
                message: 'Access Already Created',
                data: {}
            };
        }
    },
    /**
     * get sub_admin details
     * @param {*} req
     * @param {*} res
     */
    Details: async (req, res) => {
        await subAdminAccessModel.findOne({ _id: req.body._id }, function (err, StateList) {
            return {
                error: alse,
                message: 'State List',
                data: StateList
            };
        });
    },
    /**
     * login sub_admin
     * @param {*} req
     * @param {*} res
     */
    Login: async (req, res) => {
        await subAdminAccessModel.findOne({ username: req.body.username, password: req.body.password }, (err, data) => {
            if (data !== null) {
                return {
                    error: false,
                    message: 'Sub Admin Logged In Successfully',
                    data: data
                };
            } else {
                return {
                    error: true,
                    message: 'Account Not Found',
                    data: {}
                };
            }
        });
    },
    /**
     * delete sub_admin details
     * @param {*} req
     * @param {*} res
     */
    Deletes: function (req, res) {
        subAdminAccessModel.remove({}, function (err, user) {
            if (err) return res.status(500).send('There was a problem deleting the sub admin access.');
            return {
                error: false,
                message: 'subAdminAccess Deleted',
                data: {}
            };
        });
    },
    /**
     * get all sub_admin details
     * @param {*} req
     * @param {*} res
     */
    List: async (req, res) => {
        await subAdminAccessModel.find({}, (err, data) => {
            return {
                error: false,
                message: 'List Retrived SuccessFully',
                data: data
            };
        });
    },
    /**
     * update sub_admin details
     * @param {*} req
     * @param {*} res
     */
    Update: async (req, res) => {
        await subAdminAccessModel.findByIdAndUpdate(req.body._id, req.body, { new: true }, (error, UpdatedDetails) => {
            if (error)
                return {
                    error: true,
                    message: error.message,
                    data: {}
                };
            return {
                error: false,
                message: 'Record Updated Successfully',
                data: UpdatedDetails
            };
        });
    },
    /**
     * delete sub_admin
     * @param {*} req
     * @param {*} res
     */
    Delete: async (req, res) => {
        await subAdminAccessModel.findByIdAndRemove(req.body._id, function (error, user) {
            if (error)
                return {
                    error: true,
                    message: error.message,
                    data: {}
                };
            return {
                error: false,
                message: 'SubAdmin Deleted successfully',
                data: {}
            };
        });
    }
};

module.exports = SubAdminAccessController;
