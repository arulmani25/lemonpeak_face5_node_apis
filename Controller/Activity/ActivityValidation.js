const { check } = require('express-validator');

const ActivityValidate = {
    /**
     * Create Activity
     * @returns
     */
    createValidation: () => {
        return [
            check('title', 'please enter the title').trim().notEmpty(),
            check('description', 'please enter description').trim().notEmpty(),
            check('index', 'please enter index').trim().notEmpty()
        ];
    },
    /**
     * Update Status
     * @returns
     */
    updateStatusValidation: () => {
        return [
            check('activity_id', 'please enter activity_id').trim().notEmpty(),
            check('title', 'please enter the title').trim().notEmpty(),
            check('description', 'please enter description').trim().notEmpty(),
            check('index', 'please enter index').trim().notEmpty()
        ];
    },
    detailValidation: () => {
        return [check('activity_id', 'please enter the activity_id').trim().notEmpty()];
    }
};
module.exports = ActivityValidate;