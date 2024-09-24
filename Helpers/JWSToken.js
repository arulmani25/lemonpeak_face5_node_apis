const jwt = require('jsonwebtoken');
const { isEmpty } = require('../Helpers/Utils');
const { findOneUser } = require('../Repositary/Userrepositary');
const userModel = require('../Models/UserModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

let JWSToken = {
    /**
     * GenerateToken
     * @param {*} payload
     * @returns
     */
    GenerateToken: async (payload) => {
        try {
            const token = jwt.sign(payload, process.env.SECRET_KEY);
            return token;
        } catch (error) {
            return {
                error: true,
                message: error.message,
                data: {}
            };
        }
    },
    /**
     * VerifyToken
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @returns
     */
    VerifyToken: async (request, next) => {
        try {
            if (isEmpty(request?.headers?.authorization)) {
                return {
                    error: true,
                    message: 'Provide a valid JWT Token',
                    data: {}
                };
            }

            const token = request.headers.authorization?.split(' ')[1];

            jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
                if (err) {
                    return {
                        error: true,
                        message: 'Invalid Token',
                        data: {}
                    };
                }
                const loggedUser = { user_id: decoded.user_id };

                const userExist = await findOneUser({
                    user_id: loggedUser.user_id
                });

                if (!userExist) {
                    return {
                        error: true,
                        message: 'Unauthorized User',
                        data: {}
                    };
                }
                request.loggedUser = decoded;
                next();
            });
        } catch (error) {
            return {
                error: true,
                message: error.message,
                data: {}
            };
        }
    }
};

module.exports = JWSToken;
