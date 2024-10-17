const { check } = require('express-validator');

const ClientValidate = {
    /**
     * create client validator
     * @returns
     */
    createValidation: () => {
        return [check('email', 'email is not empty').trim().notEmpty()];
    }
};
module.exports = ClientValidate;
