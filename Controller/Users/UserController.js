const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const mongoose = require('mongoose');
const UserModel = require('../../Models/UserModel');
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require('bcryptjs');
const { getNanoId, isEmpty } = require('../../Helpers/Utils');
const { GenerateToken } = require('../../Helpers/JWSToken');
const { checkPassword } = require('../../Helpers/passwordvalidation');
const { sendMailNotification } = require('../../Helpers/mailservice');
const { createUser, findOneUser, deleteUser } = require('../../Repositary/Userrepositary');
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
            let userData = await UserModel.find(queryObject, projection)
                .limit(limit)
                .skip((page - 1) * limit)
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
            if(token?.error === true) {
                return {
                    error: true,
                    message: token?.message,
                    data: {}
                };
            }
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
    UpdatePassword: async (requestData) => {
        try {
            if (requestData?.oldPassword === requestData?.newPassword) {
                return {
                    error: 'Failed',
                    message: 'Looks Similar To Previous Password',
                    data: {}
                };
            }
            const User = await findOneUser(requestData?.user_id);
            if (isEmpty(User)) {
                return {
                    error: 'Failed',
                    message: 'User is not found',
                    data: {}
                };
            }
            const isValidPassword = await checkPassword(requestData?.oldPassword, User?.password);
            if (!isValidPassword) {
                return {
                    error: true,
                    message: 'Incorrect Password',
                    deleteUserata: {}
                };
            }
            const hashedPassword = await hashPassword(requestData?.newPassword);
            User.password = hashedPassword ?? User?.password;
            User.markModified('password');
            let result = await User.save();
            if (!isEmpty(result)) {
                return {
                    error: false,
                    message: 'Password updated successfully',
                    data: {}
                };
            } else {
                return {
                    error: true,
                    message: 'Password updation failure',
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
     * forgot user password
     * @param {*} req
     * @param {*} res
     * @returns
     */
    ForgotPassword: async (requestData) => {
        try {
            const user = await findOneUser({
                $or: [{ email: requestData?.email }, { username: requestData?.username }]
            });
            if (!user) {
                return {
                    error: true,
                    message: 'User is not found',
                    data: {}
                };
            }
            const random = `Password@${Math.floor(Math.random() * 9999)}`;
            const emailTemplate = `
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
            const mailSent = await sendMailNotification(user.email, 'Reset Password', emailTemplate);

            if (mailSent?.error === true) {
                return {
                    error: 'error',
                    message: 'Failed to send email',
                    data: {}
                };
            }
            const hashedPassword = await hashPassword(random);
            let getUser = await findOneUser({ user_id: user?.user_id });
            getUser.password = hashedPassword ?? getUser?.password;
            getUser.markModified('password');
            let result = await getUser.save();

            if (!isEmpty(result)) {
                return {
                    error: false,
                    message: 'Password send to mail successfully',
                    data: {}
                };
            } else {
                return {
                    error: true,
                    message: 'Password updation failure',
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

module.exports = UserController;
