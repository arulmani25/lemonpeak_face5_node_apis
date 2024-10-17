const { check } = require('express-validator');

const AttendanceValidate = {
    /**
     * Create Attendance
     * @returns
     */
    createValidation: () => {
        return [
            check('userPhoneNumber', 'please enter the userPhoneNumber').trim().notEmpty(),
            check('location', 'please enter location').trim().notEmpty(),
            check('lat', 'please enter lat').trim().notEmpty(),
            check('lan', 'please enter lan').trim().notEmpty()
        ];
    }
};
module.exports = AttendanceValidate;
