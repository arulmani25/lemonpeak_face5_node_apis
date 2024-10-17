const { check } = require('express-validator');

const AccessConfigValidate = {
    /**
     * create access_config
     * @returns
     */
    createValidation: () => {
        return [
            check('access_config', 'please enter the access_config').trim().notEmpty(),
            check('role', 'please enter role').trim().notEmpty()
        ];
    }
};
module.exports = AccessConfigValidate;
