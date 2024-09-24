const { check } = require('express-validator');

const UserTypeValidate = {
    /**
     * Create user
     * @returns
     */
    createValidation: () => {
        return [
            check('clientId', 'please enter the clientId').trim().notEmpty(),
            check('username', 'please enter username').trim().notEmpty(),
            check('email', 'please enter email').trim().notEmpty(),
            check('phoneNumber', 'please enter the phoneNumber').trim().notEmpty(),
            check('password', 'please enter password').trim().notEmpty(),
            check('firstName', 'please enter firstName').trim().notEmpty(),
            check('lastName', 'please enter the lastName').trim().notEmpty(),
            check('user_type_id', 'please enter user_type_id').trim().notEmpty()
        ];
    },
    /**
     * Update user
     * @returns
     */
    updateValidation: () => {
        return [check('user_id', 'please enter the user_id').trim().notEmpty()];
    }
};
module.exports = UserTypeValidate;
