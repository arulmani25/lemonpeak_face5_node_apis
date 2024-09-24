const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const mongoose = require('mongoose');
const User = require('../../Models/UserModel');
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require('bcryptjs');
const { getNanoId, isEmpty } = require('../../Helpers/Utils');
const { GenerateToken } = require('../../Helpers/JWSToken');
const { checkPassword } = require('../../Helpers/passwordvalidation');
const { sendMailNotification } = require('../../Helpers/mailservice');
const { createUser, findOneUser, findUser, deleteUser } = require('../../Repositary/Userrepositary');
const { findOneUserType } = require('../../Repositary/UserTyperepositary');

function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

const UserController = {
    /**
     * create user
     * @param {*} requestData
     * @returns
     */
    Create: async (requestData) => {
        try {
            if (
                !requestData?.username ||
                !requestData?.email ||
                !requestData?.password ||
                !requestData?.firstName ||
                !requestData?.lastName
            ) {
                return {
                    error: true,
                    message: 'Required fields are missing',
                    data: {}
                };
            }

            const existingUsername = await findOneUser({
                username: requestData?.username
            });
            if (existingUsername) {
                return {
                    error: true,
                    message: 'Username already exists',
                    data: {}
                };
            }

            const existingEmail = await findOneUser({ email: requestData?.email });
            if (existingEmail) {
                return {
                    error: true,
                    message: 'Email already exists',
                    data: {}
                };
            }
            let UserType = await findOneUserType({ user_type_id: requestData?.user_type_id });
            console.log('UserType', UserType);
            if (isEmpty(UserType)) {
                return {
                    error: true,
                    message: 'User_type is not found',
                    data: {}
                };
            }
            const hashedPassword = await hashPassword(requestData?.password);
            requestData.password = hashedPassword;
            let requestObject = {
                user_id: getNanoId(),
                clientId: requestData?.clientId,
                username: requestData?.username,
                email: requestData?.email,
                phoneNumber: requestData?.phoneNumber,
                password: requestData?.password,
                firstName: requestData?.firstName,
                lastName: requestData?.lastName ?? '',
                fcm_token: requestData?.fcm_token ?? '',
                isActive: requestData?.isActive,
                user_type_id: UserType?.user_type_id
            };
            const newUser = await createUser(requestObject);
            return {
                status: false,
                message: 'User created successfully',
                debuggerata: newUser
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
     * filter user details
     * @param {*} query
     * @param {*} UserID
     * @returns
     */
    List: async (query, UserID) => {
        try {
            let queryObject = {};
            let limit = query?.limit ? Number.parseInt(query?.limit) : 20;
            let page = query?.page ? Number.parseInt(query?.page) : 1;

            if (query?.user_id) queryObject['user_id'] = query?.user_id;
            if (query?.clientId) queryObject['clientId'] = query?.clientId;
            if (query?.username) queryObject['username'] = query?.username;

            if (query?.email) queryObject['email'] = query?.email;
            if (query?.phoneNumber) queryObject['phoneNumber'] = query?.phoneNumber;
            if (query?.firstName) queryObject['firstName'] = query?.firstName;
            if (query?.lastName) queryObject['lastName'] = query?.lastName;
            if (query?.isActive) queryObject['isActive'] = query?.isActive;
            if (query?.user_type_id) queryObject['user_type_id'] = query?.user_type_id;

            if (query?.from_date || query?.to_date || query.date_option) {
                queryObject['createdAt'] = dateFinder(query);
            }
            if (UserID) {
                queryObject['user_id'] = UserID;
            }
            let projection = {
                _id: 0,
                __v: 0
            };
            let userData = await findUser(queryObject, projection)
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ _id: -1 })
                .lean();
            if (isEmpty(userData)) {
                return {
                    error: true,
                    message: 'user list is not found',
                    data: undefined
                };
            }
            return {
                error: false,
                message: 'user list',
                data: userData
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
     * user details
     * @param {*} userID
     * @returns
     */
    Details: async (userID) => {
        try {
            if (isEmpty(userID)) {
                return {
                    error: true,
                    message: 'userid is not empty',
                    data: undefined
                };
            }
            let projection = {
                _id: 0,
                __v: 0
            };
            let result = await findOneUser({ user_id: user_type_id }, projection);
            if (isEmpty(result)) {
                return {
                    error: true,
                    message: 'User details is not found',
                    data: undefined
                };
            } else {
                return {
                    error: false,
                    message: 'User details are.',
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
     * update use details
     * @param {*} requestData
     * @returns
     */
    Update: async (requestData) => {
        try {
            let isExistUser = await findOneUser({
                $or: [
                    { username: { $regex: new RegExp(`^${requestData?.username}$`, 'i') } },
                    { phoneNumber: requestData?.phoneNumber },
                    { email: requestData?.email }
                ]
            });
            if (!isEmpty(isExistUser)) {
                return {
                    error: true,
                    message: 'Duplicate user found: either username,email or phone number already exists.',
                    data: undefined
                };
            }
            let getUserType = await findOneUserType({ user_type_id: requestData?.user_type_id });
            if (isEmpty(getUserType)) {
                return {
                    error: true,
                    message: 'User_type is not found',
                    data: {}
                };
            }
            let getUser = await findOneUser({ user_id: requestData?.user_id });
            if (isEmpty(getUser)) {
                return {
                    error: true,
                    message: 'User details is not found',
                    data: undefined
                };
            } else {
                getUser.username = requestData?.username ?? getUser?.username;
                getUser.phoneNumber = requestData?.phoneNumber ?? getUser?.phoneNumber;
                getUser.email = requestData?.email ?? getUser?.email;
                getUser.firstName = requestData?.email ?? getUser?.firstName;
                getUser.lastName = requestData?.lastName ?? getUser?.lastName;
                getUser.user_type_id = requestData?.user_type_id ?? getUser?.user_type_id;

                getUser.markModified(['username', 'phoneNumber', 'email', 'firstName', 'lastName', 'user_type_id']);

                let result = await getUser.save();
                if (!isEmpty(result)) {
                    return response.send({
                        error: false,
                        message: 'User update successfully!!'
                    });
                }
                return response.send({
                    error: false,
                    message: 'Something went wrong!'
                });
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
     * delete user
     * @param {*} user_id
     * @returns
     */
    Delete: async (user_id) => {
        try {
            if (isEmpty(user_id)) {
                return {
                    error: true,
                    message: 'user_id is not empty',
                    data: undefined
                };
            }
            let User = await findOneUser({ user_id: user_id });
            if (isEmpty(User)) {
                return {
                    error: true,
                    message: 'user is not found',
                    data: {}
                };
            } else {
                let result = await deleteUser({ user_id: User?.user_id });
                if (result.acknowledged === true && result.deletedCount > 0) {
                    return {
                        error: false,
                        message: 'user deleted successfully!',
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
    },
    /**
     * login user
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Login: async (requestData, fcm) => {
        try {
            let user = await findOneUser(
                {
                    $or: [{ username: requestData?.username }, { email: requestData?.email }]
                },
                {}
            );
            if (isEmpty(user)) {
                return {
                    error: true,
                    message: 'user is not found',
                    data: {}
                };
            }
            const isValidPassword = await checkPassword(requestData?.password, user?.password);
            if (!isValidPassword) {
                return {
                    error: true,
                    message: 'Incorrect Password',
                    data: {}
                };
            }
            const token = await GenerateToken({
                user_id: String(user?.user_id),
                user_type: user?.userType
            });
            user['_doc'].token = token;
            delete user['_doc'].password;
            return {
                error: false,
                message: 'User Logged successfully',
                data: user
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
     * update user password
     * @param {*} req
     * @param {*} res
     * @returns
     */
    UpdatePassword: async (req, res) => {
        try {
            if (req.body.oldPassword === req.body.newPassword) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'Looks Similar To Previous Password',
                    Data: {},
                    Code: 404
                });
            }
            const user = await User.findById(req.body.id);
            if (!user) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'User not found',
                    Data: {},
                    Code: 404
                });
            }
            const isValidPassword = await checkPassword(req.body.oldPassword, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    Status: 'Failed',
                    Message: 'Incorrect Old Password',
                    Data: {},
                    Code: 401
                });
            }
            const hashedPassword = await hashPassword(req.body.newPassword);

            const updateNewPassword = await User.findOneAndUpdate(
                {
                    _id: new ObjectId(user._id)
                },
                { $set: { password: hashedPassword } }
            );

            return res.status(200).json({
                Status: 'Success',
                Message: 'Password Updated Successfully',
                Data: {},
                Code: 200
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    },
    /**
     * forgot user password
     * @param {*} req
     * @param {*} res
     * @returns
     */
    ForgotPassword: async (req, res) => {
        try {
            const user = await User.findOne({
                $or: [{ email: req.body.username }, { username: req.body.username }]
            });
            if (!user) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'User not found',
                    Data: {},
                    Code: 404
                });
            }
            const random = `Password@${Math.floor(Math.random() * 9999)}`;
            const template = `
            <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow:auto; line-height: 2">
              <div style="margin: 50px auto; width: 70%; padding: 20px 0">
                <div style="border-bottom: 1px solid #eee">
                  <a href="" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600">Face5</a>
                </div>
                <p style="font-size: 1.1em">Hello,</p>
                <p>We received a request to reset your password for your Face5 account. Use the following password to reset your new password</p>
                <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${random}</h2>
                <p style="font-size: 0.9em;">If you didn't request a password reset, you can ignore this email.</p>
                <p style="font-size: 0.9em;">Regards,<br />Face5</p>
                <hr style="border: none; border-top: 1px solid #eee" />
                <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300">
                  <p>Face5 Inc</p>
                  <p>1600 Amphitheatre Parkway</p>
                  <p>California</p>
                </div>
              </div>
            </div>
          `;
            const mailSent = await sendMailNotification(user.email, 'Reset Password', template);

            const hashedPassword = await hashPassword(random);

            const updateNewPassword = await User.findOneAndUpdate(
                {
                    _id: new ObjectId(user._id)
                },
                { $set: { password: hashedPassword } }
            );

            return res.status(200).json({
                Status: 'Success',
                Message: 'Password Sent To Mail',
                Data: {},
                Code: 200
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    }
};

module.exports = UserController;
