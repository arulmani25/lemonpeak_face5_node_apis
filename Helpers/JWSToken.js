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
            console.log(error);
        }
    },
    /**
     * VerifyToken
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @returns
     */
    VerifyToken: async (request, response, next) => {
        try {
            // if (!request.headers.authorization) throw new Error('Provide a valid JWT Token');
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
                    // return response.send({ status: 401, message: 'Invalid Token' });
                    return {
                        error: true,
                        message: 'Invalid Token'
                    };
                }
                const loggedUser = { user_id: decoded.user_id };

                const userExist = await findOneUser({
                    user_id: loggedUser.user_id
                });

                if (!userExist) {
                    return response.status(401).json({
                        status: 401,
                        message: 'Unauthorized User'
                    });
                }
                request.loggedUser = decoded;
                next();
                // else {
                //     let loggedUser = { user_id: decoded.user_id };

                //     const userExist = await userModel.findOne({
                //         user_id: loggedUser.user_id
                //     });

                //     if (!userExist) {
                //         return res.send({ status: 401, message: 'UnAuthorized User' });
                //     }
                //     req.loggedUser = decoded;
                //     next();
                // }
            });
        } catch (error) {
            // return response.send({ status: 401, message: error.message });
            return {
                error: true,
                message: error.message,
                data: {}
            };
        }
    }
};

module.exports = JWSToken;
