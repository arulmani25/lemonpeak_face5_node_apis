const { check } = require('express-validator');

const UserTypeValidate = {
    /**
     * Create user_type
     * @returns
     */
    createValidation: () => {
        return [
            check('name', 'please enter the name').trim().notEmpty(),
            check('code', 'please enter code').trim().notEmpty(),
            check('description', 'please enter description').trim().notEmpty()
        ];
    },
    /**
     * Update user_type
     * @returns
     */
    updateValidation: () => {
        return [
            check('name', 'please enter name').trim().notEmpty(),
            check('code', 'please enter the code').trim().notEmpty(),
            check('description', 'please enter description').trim().notEmpty()
        ];
    }
};
module.exports = UserTypeValidate;
