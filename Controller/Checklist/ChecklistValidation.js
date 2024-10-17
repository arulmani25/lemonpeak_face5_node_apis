const { check } = require('express-validator');

const ChecklistValidate = {
    /**
     * create checklist validator
     * @returns
     */
    createValidation: () => {
        return [
            check('equipment_id').optional().trim().notEmpty().withMessage('Equipment ID cannot be empty'),
            check('main_activity_id').optional().trim().notEmpty().withMessage('Main Activity ID cannot be empty'),
            check(['equipment_id', 'main_activity_id']).custom((value, { req }) => {
                if (!req.body.equipment_id && !req.body.main_activity_id) {
                    throw new Error('Either Equipment ID or Main Activity ID must be provided');
                }
                return true;
            }),
            check(['equipment_id', 'frequency']).custom((value, { req }) => {
                const { equipment_id, frequency } = req?.body;

                // If equipment_id is provided, checked_to must also be provided
                if (equipment_id && !frequency) {
                    throw new Error('If equipment_id is provided, frequency must also be provided');
                }

                return true;
            }),
            check('index', 'Index must be a valid integer greater than 0').trim().notEmpty().isInt({ min: 1 })
        ];
    }
};
module.exports = ChecklistValidate;
