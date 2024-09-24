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
            check('password', 'please enter password')
                .trim()
                .notEmpty()
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long')
                .matches(/[A-Z]/)
                .withMessage('Password must contain at least one uppercase letter')
                .matches(/[a-z]/)
                .withMessage('Password must contain at least one lowercase letter')
                .matches(/\d/)
                .withMessage('Password must contain at least one number')
                .matches(/[!@#$%^&*(),.?":{}|<>]/)
                .withMessage('Password must contain at least one special character'),
            check('firstName', 'please enter firstName').trim().notEmpty(),
            check('lastName', 'please enter the lastName').trim().notEmpty(),
            check('user_type_id', 'please enter user_type_id').trim().notEmpty()
        ];
    },
    /**
     * update user
     * @returns
     */
    updateValidation: () => {
        return [check('user_id', 'please enter the user_id').trim().notEmpty()];
    },
    /**
     * update user new_password
     * @returns
     */
    updatePassWordValidation: () => {
        return [
            check('user_id', 'please enter the user_id').trim().notEmpty(),
            check('oldPassword', 'pleae enter the old_password').trim().notEmpty(),
            check('newPassword', 'please enter new_password')
                .trim()
                .notEmpty()
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long')
                .matches(/[A-Z]/)
                .withMessage('Password must contain at least one uppercase letter')
                .matches(/[a-z]/)
                .withMessage('Password must contain at least one lowercase letter')
                .matches(/\d/)
                .withMessage('Password must contain at least one number')
                .matches(/[!@#$%^&*(),.?":{}|<>]/)
                .withMessage('Password must contain at least one special character')
        ];
    }
};
module.exports = UserTypeValidate;
