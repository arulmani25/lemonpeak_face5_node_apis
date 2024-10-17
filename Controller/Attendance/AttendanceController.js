const Express = require('express');
const Router = Express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const moment = require('moment');
const Attendance = require('../../Models/AttendanceModel');
const {
    createAttendance,
    findAttendance,
    findOneAttendance,
    updateAttendance,
    deleteAttendance
} = require('../../Repositary/attendancerepositary');
const { getNanoId, isEmpty } = require('../../Helpers/Utils');

const AttendanceController = {
    /**
     * create attendance
     * @param {*} requestData
     * @returns
     */
    Create: async (requestData) => {
        try {
            let requestObject = {
                attendance_id: getNanoId(),
                userName: requestData?.userName ?? '',
                userPhoneNumber: requestData?.userPhoneNumber,
                checkInTime: requestData?.checkInTime ?? '',
                checkOutTime: requestData?.checkOutTime ?? '',
                lat: requestData?.lat,
                lan: requestData?.lan,
                location: requestData?.location
            };
            const record = await createAttendance(requestObject);
            return {
                error: false,
                message: 'Attendance submitted successfully',
                data: record
            };
        } catch (error) {
            return {
                error: true,
                message: error.message,
                data: {}
            };
        }
    },
    /**
     * Get last_status
     * @param {*} query
     * @returns
     */
    Getlaststatus: async (query) => {
        try {
            if (isEmpty(query)) {
                return {
                    error: true,
                    message: 'request value is empty',
                    data: {}
                };
            }
            const startDate = moment();
            const attendanceList = await Attendance.find({
                userPhoneNumber: query?.userPhoneNumber,
                createdAt: {
                    $gte: new Date(startDate.startOf('days')),
                    $lte: new Date(startDate.endOf('days'))
                }
            });
            const result = attendanceList.length ? attendanceList.at(-1) : [];
            return {
                error: false,
                message: 'record retrieved successfully',
                data: result
            };
        } catch (error) {
            return {
                error: true,
                message: error.message,
                data: {}
            };
        }
    },
    /**
     * get attendance list
     * @param {*} requestData
     * @returns
     */
    List: async (requestData) => {
        try {
            const startDate = moment(requestData?.fromDate);
            const endDate = moment(requestData?.toDate);

            const result = await Attendance.aggregate([
                {
                    $match:
                        requestData?.userPhoneNumber && requestData?.fromDate && requestData?.toDate
                            ? {
                                  userPhoneNumber: requestData?.userPhoneNumber,
                                  createdAt: {
                                      $gte: new Date(startDate.startOf('days')),
                                      $lte: new Date(endDate.endOf('days'))
                                  }
                              }
                            : {
                                  createdAt: {
                                      $gte: new Date(startDate.startOf('days')),
                                      $lte: new Date(endDate.endOf('days'))
                                  }
                              }
                },
                {
                    $addFields: {
                        date: {
                            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                        }
                    }
                },
                {
                    $sort: { createdAt: 1 }
                },
                {
                    $group: {
                        _id: {
                            date: '$date',
                            userPhoneNumber: '$userPhoneNumber'
                        },
                        firstRecord: { $first: '$$ROOT' },
                        lastRecord: { $last: '$$ROOT' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        date: '$_id.date',
                        userPhoneNumber: '$_id.userPhoneNumber',
                        firstRecord: 1,
                        lastRecord: 1
                    }
                }
            ]);

            const finalRecord = [];
            result.forEach((iterator) => {
                finalRecord.push({
                    date: iterator.date,
                    userName: iterator.firstRecord.userName,
                    userPhoneNumber: iterator.firstRecord.userPhoneNumber,
                    checkInTime: iterator.firstRecord.checkInTime ? iterator.firstRecord.createdAt : '',
                    checkOutTime: iterator.lastRecord.checkOutTime ? iterator.lastRecord.createdAt : '',
                    checkInlocation: iterator.firstRecord.checkInTime ? iterator.firstRecord.location : '',
                    checkOutlocation: iterator.lastRecord.checkOutTime ? iterator.lastRecord.location : ''
                });
            });

            return {
                error: false,
                message: 'Attendance retrieved successfully',
                data: finalRecord
            };
        } catch (error) {
            return {
                error: 'Failed',
                message: error.message,
                data: {}
            };
        }
    },
    /**
     * EmpList
     * @param {*} requestData
     * @param {*} res
     * @returns
     */
    EmpList: async (requestData) => {
        try {
            const startDate = moment(requestData?.fromDate);
            const endDate = moment(requestData?.toDate);

            const activity = await Attendance.aggregate([
                {
                    $match:
                        requestData?.userPhoneNumber && requestData?.fromDate && requestData?.toDate
                            ? {
                                  userPhoneNumber: requestData?.userPhoneNumber,
                                  createdAt: {
                                      $gte: new Date(startDate.startOf('days')),
                                      $lte: new Date(endDate.endOf('days'))
                                  }
                              }
                            : {
                                  createdAt: {
                                      $gte: new Date(startDate.startOf('days')),
                                      $lte: new Date(endDate.endOf('days'))
                                  }
                              }
                },
                {
                    $sort: { createdAt: -1 }
                }
            ]);

            return {
                error: false,
                message: 'Attendance retrieved successfully',
                data: activity
            };
        } catch (error) {
            return {
                error: true,
                message: error.message,
                data: {}
            };
        }
    }
};

module.exports = AttendanceController;
