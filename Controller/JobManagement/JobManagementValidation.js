const { check } = require('express-validator');

const JobmanagementValidate = {
    /**
     * create validator
     * @returns
     */
    createValidation: () => {
        return [check('email', 'email is not empty').trim().notEmpty()];
    }
};
module.exports = JobmanagementValidate;
