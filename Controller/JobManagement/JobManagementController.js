const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const moment = require('moment');
const JobManagementModel = require('../../Models/JobManagementModel');
const { jobStatus } = require('../../Helpers');
const JobLocationTracking = require('../../Models/JobLocationTrackingModel');
const { generatePdf } = require('../../Helpers/pdfGenerates');

const JobManagementController = {
    /**
     * create jobmanagement
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    create : async (req, res) => {
        try {
            if (!req.body.siteId || !req?.body?.activityId) {
                return res.status(400).json({
                    Status: 'Failed',
                    Message: 'ActivityId and  SiteId are required fields',
                    Data: {},
                    Code: 400
                });
            }
            const jobId = moment().format('YYYYMMDDHHmmss');
            req.body.jobId = `JB${jobId}`;
            const getUser = await User.findOne({
                _id: new ObjectId(req?.body?.techName)
            });
            req.body.techName = getUser?.username;
            req.body.techNumber = getUser?.phoneNumber;
            req.body.is_master = true;
            const newJob = await JobManagementModel.create(req?.body);
            return res.status(200).json({
                Status: 'Success',
                Message: 'Job created successfully',
                Data: newJob,
                Code: 200
            });
        } catch (error) {
            console.log('=====error', error);
            return res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    },
    /**
     * get all jobmanagement list
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    List : async (req, res) => {
        try {
            const {
                searchKey,
                skip,
                limit,
                sortkey,
                sortOrder,
                clientId,
                siteId,
                activityId,
                subActivityId,
                jobStatus,
                techNumber
            } = req.query;
    
            const sort = {
                [sortkey ? sortkey : 'createdAt']: !sortOrder || sortOrder === 'DESC' ? -1 : 1
            };
    
            const searchRegex = new RegExp(['^.*', searchKey, '.*$'].join(''), 'i');
    
            const jobs = await JobManagementModel.aggregate([
                {
                    $match: clientId ? { clientId: new ObjectId(clientId) } : {}
                },
                {
                    $match: siteId ? { siteId: new ObjectId(siteId) } : {}
                },
                {
                    $match: activityId ? { activityId: new ObjectId(activityId) } : {}
                },
                {
                    $match: subActivityId
                        ? {
                              activityId: new ObjectId(activityId),
                              subActivityId: new ObjectId(subActivityId)
                          }
                        : {}
                },
                {
                    $match: techNumber
                        ? {
                              techNumber: techNumber
                          }
                        : {}
                },
                {
                    $match: jobStatus ? { jobStatus: jobStatus } : {}
                },
                {
                    $lookup: {
                        from: 'sitemanagements',
                        localField: 'siteId',
                        foreignField: '_id',
                        as: 'siteInfo'
                    }
                },
                {
                    $lookup: {
                        from: 'activities',
                        localField: 'activityId',
                        foreignField: '_id',
                        as: 'activityInfo'
                    }
                },
                {
                    $lookup: {
                        from: 'subactivities',
                        localField: 'subActivityId',
                        foreignField: '_id',
                        as: 'subActivityInfo'
                    }
                },
                {
                    $unwind: {
                        path: '$siteInfo',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: '$activityInfo',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: '$subActivityInfo',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: searchKey
                        ? {
                              $or: [{}]
                          }
                        : {}
                },
                {
                    $sort: sort
                },
                {
                    $facet: {
                        pagination: [{ $count: 'totalCount' }],
                        data: [{ $skip: Number(skip) || 0 }]
                    }
                }
            ]);
            return res.status(200).json({
                Status: 'Success',
                Message: 'Jobs retrieved successfully',
                Data: jobs,
                Code: 200
            });
        } catch (error) {
            console.error('Error fetching Jobs:', error);
            return res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    },
    /**
     * get job_management details
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    Details : async (req, res) => {
        try {
            const job = await JobManagementModel.findById(req.params.id);
            if (!job) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'Job not found',
                    Data: {},
                    Code: 404
                });
            }
            return res.status(200).json({
                Status: 'Success',
                Message: 'Job retrieved successfully',
                Data: job,
                Code: 200
            });
        } catch (error) {
            console.error('Error fetching job:', error);
            return res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    },
    /**
     * update job_management  details
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    Update : async (req, res) => {
        try {

            const job = await JobManagementModel.findByIdAndUpdate(req.body.id, req.body, {
                new: true
            });
            if (!job) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'job not found',
                    Data: {},
                    Code: 404
                });
            }
            return res.json({
                Status: 'Success',
                Message: 'Job updated successfully',
                Data: job,
                Code: 200
            });
        } catch (error) {
            return res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    },
    /**
     * update job status
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    UpdateStatus : async (req, res) => {
        try {
            let createJob;
            let createLocationTracking;
            // Basic input validation
            const job = await JobManagementModel.findById(req?.params?.id);
            if (!job) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'job not found',
                    Data: {},
                    Code: 404
                });
            }
            const jobStatusUpdate = await JobManagementModel.findOneAndUpdate(
                {
                    _id: req?.params?.id
                },
                {
                    $set: {
                        jobStatus: req?.body?.jobStatus
                    }
                },
                {
                    new: true
                }
            );
            jobStatusUpdate.markModified('jobStatus');
            await jobStatusUpdate.save();
    
            // jobStatusUpdate.jobStatus = req.body.jobStatus;
            // delete jobStatusUpdate._id;
    
            // createJob = await JobManagementModel.create({ ...jobStatusUpdate });
    
            createLocationTracking = await JobLocationTracking.create({
                jobId: job?.jobId,
                techNumber: job?.techNumber,
                location: req?.body?.jobAddress,
                lat: req?.body?.lat,
                lng: req?.body?.lng,
                date: req?.body?.date,
                ativityType: req?.body?.ativityType,
                status: req?.body?.jobStatus
            });
            return res.json({
                Status: 'Success',
                Message: 'Job updated successfully',
                Data: {},
                Code: 200
            });
        } catch (error) {
            return res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    },
    /**
     * delete job
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    DeleteJobManagement : async (req, res) => {
        try {
            const deletedJob = await JobManagementModel.findByIdAndDelete(req.params.id);
            if (!deletedJob) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'Job not found',
                    Data: {},
                    Code: 404
                });
            }
            res.json({
                Status: 'Success',
                Message: 'Job deleted successfully',
                Data: deletedJob,
                Code: 200
            });
        } catch (error) {
            res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    },
    /**
     * track_employee_details
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    TrackEmployee : async (req, res) => {
        try {
            const startDate = moment(req.query.fromDate);
            const endDate = moment(req.query.toDate);
            const data = await JobLocationTracking.find({
                techNumber: req.query.techNumber,
                createdAt: {
                    $gte: new Date(startDate.startOf('days')),
                    $lte: new Date(endDate.endOf('days'))
                }
            });
            const responseData = [];
            for (const iterator of data) {
                responseData.push({
                    isActive: iterator.isActive,
                    _id: iterator._id,
                    job_no: iterator.jobId,
                    user_mobile_no: iterator.techNumber,
                    location_text: iterator.location,
                    loc_lat: iterator.lat,
                    loc_lng: iterator.lng,
                    date: iterator.date,
                    ativityType: iterator.ativityType,
                    status: iterator.status,
                    createdAt: iterator.createdAt,
                    updatedAt: iterator.updatedAt,
                    __v: iterator.__v
                });
            }
            return res.status(200).json({
                Status: 'Success',
                Message: 'Employee Tracking retrieved successfully',
                Data: responseData,
                Code: 200
            });
        } catch (error) {
            console.error('Error fetching list:', error);
            return res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    },
    /**
     * jobmanagement dashboard
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    Dashboard : async (req, res) => {
        try {
            // Basic input validation
            const endDate = moment(req.body.toDate);
    
            const dashboardData = await JobManagementModel.aggregate([
                {
                    $match: req.body.siteId
                        ? {
                              siteId: new ObjectId(req.body.siteId)
                          }
                        : {}
                },
                {
                    $match: req.body.activityId
                        ? {
                              activityId: new ObjectId(req.body.activityId)
                          }
                        : {}
                },
                {
                    $match:
                        req.body.fromDate && req.body.toDate
                            ? {
                                  createdAt: {
                                      $gte: new Date(req.body.fromDate),
                                      $lte: new Date(endDate.endOf('days'))
                                  }
                              }
                            : {}
                },
                {
                    $group: {
                        _id: '$jobStatus',
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]);
    
            const obj = {
                JOB_COMPLETED: 0,
                JOB_PAUSED: 0,
                JOB_STARTED: 0,
                NOT_STARTED: 0
            };
    
            dashboardData.forEach((el) => {
                if (el._id === jobStatus.JOB_COMPLETED) {
                    obj.JOB_COMPLETED = el.count;
                } else if (el._id === jobStatus.JOB_PAUSED) {
                    obj.JOB_PAUSED = el.count;
                } else if (el._id === jobStatus.JOB_STARTED) {
                    obj.JOB_STARTED = el.count;
                } else if (el._id === jobStatus.NOT_STARTED) {
                    obj.NOT_STARTED = el.count;
                }
            });
    
            return res.json({
                Status: 'Success',
                Message: 'Dashboard Data retrived successfully',
                Data: obj,
                Code: 200
            });
        } catch (error) {
            return res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    },
    /**
     * geaph details in jobmanagement list
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    Graphdata : async (req, res) => {
        try {
            const fromDate = req.body.fromDate;
            const toDate = req.body.toDate;
    
            const dateList = [];
    
            const barchatData = [];
    
            const groupData = [];
    
            const keysToAdd = [jobStatus.JOB_COMPLETED, jobStatus.JOB_PAUSED, jobStatus.JOB_STARTED, jobStatus.NOT_STARTED];
            const barChartData1 = [
                { data: barchatData, label: 'Job Completed' },
                { data: barchatData, label: 'Job Paused' },
                { data: barchatData, label: 'Job Started' },
                { data: barchatData, label: 'Job Not Started' }
            ];
    
            let barChartLabels;
    
            const tempData = [];
    
            let barChart_data;
    
            if (fromDate && toDate) {
                const from_date = moment(fromDate);
                const endDate = moment(toDate);
                const diff = endDate.diff(from_date, 'days');
                dateList.push(moment(toDate).format('YYYY-MM-DD'));
    
                const differenceInDays = endDate.diff(from_date, 'days');
    
                for (let i = 0; i <= diff - 1; i++) {
                    dateList.push(endDate.subtract(1, 'days').format('YYYY-MM-DD'));
                }
                barChartLabels = [dateList].flat(1);
    
                for (const iterator of barChartLabels) {
                    const customDate = moment(iterator);
    
                    const data = await jobManagementModel.aggregate([
                        {
                            $match: req.body.siteId ? { siteId: new ObjectId(req.body.siteId) } : {}
                        },
                        {
                            $match: {
                                createdAt: {
                                    $gte: new Date(customDate.startOf('days')),
                                    $lte: new Date(customDate.endOf('days'))
                                }
                            }
                        },
                        {
                            $group: {
                                _id: '$jobStatus',
                                count: {
                                    $sum: 1
                                }
                            }
                        }
                    ]);
                    tempData.push({ date: iterator, temp: data });
                }
    
                for (const iterator of tempData) {
                    if (iterator.temp.length > 0) {
                        iterator.temp.forEach((el) => {
                            groupData.push({ date: iterator.date, [el._id]: el.count });
                        });
                    } else {
                        groupData.push({
                            date: iterator.date,
                            [jobStatus.JOB_COMPLETED]: 0,
                            [jobStatus.JOB_PAUSED]: 0,
                            [jobStatus.JOB_STARTED]: 0,
                            [jobStatus.NOT_STARTED]: 0
                        });
                    }
                }
    
                // Initialize an object to hold the grouped data
                const groupedData = {};
    
                // Iterate through the input data
                groupData.forEach((item) => {
                    const { date, ...statusCounts } = item;
    
                    // If the date is not in the groupedData, initialize it
                    if (!groupedData[date]) {
                        groupedData[date] = {
                            date: date,
                            'JOB COMPLETED': 0,
                            'JOB PAUSED': 0,
                            'JOB STARTED': 0,
                            'NOT STARTED': 0
                        };
                    }
    
                    // Add the status counts to the corresponding date
                    Object.keys(statusCounts).forEach((status) => {
                        groupedData[date][status] += statusCounts[status];
                    });
                });
    
                // Convert the grouped data back to an array format
                const result = Object.values(groupedData);
    
                result.forEach((item) => {
                    keysToAdd.forEach((key) => {
                        if (!item.hasOwnProperty(key)) {
                            item[key] = 0;
                        }
                    });
                });
    
                barChart_data = [
                    {
                        data: result.map((item) => item['JOB COMPLETED']),
                        label: 'Job Completed'
                    },
                    {
                        data: result.map((item) => item['JOB PAUSED']),
                        label: 'Job Paused'
                    },
                    {
                        data: result.map((item) => item['JOB STARTED']),
                        label: 'Job Started'
                    },
                    {
                        data: result.map((item) => item['NOT STARTED']),
                        label: 'Job Not Started'
                    }
                ];
            } else {
                const currentDate = moment();
    
                dateList.push(currentDate.format('YYYY-MM-DD'));
    
                for (let i = 0; i <= 6; i++) {
                    dateList.push(currentDate.subtract(1, 'days').format('YYYY-MM-DD'));
                }
                barChartLabels = [dateList].flat(1);
    
                for (const iterator of dateList) {
                    const customDate = moment(iterator);
                    const data = await jobManagementModel.aggregate([
                        {
                            $match: req.body.siteId ? { siteId: new ObjectId(req.body.siteId) } : {}
                        },
                        {
                            $match: {
                                createdAt: {
                                    $gte: new Date(customDate.startOf('days')),
                                    $lte: new Date(customDate.endOf('days'))
                                }
                            }
                        },
                        {
                            $group: {
                                _id: '$jobStatus',
                                count: {
                                    $sum: 1
                                }
                            }
                        }
                    ]);
                    tempData.push({ date: iterator, temp: data });
                }
    
                for (const iterator of tempData) {
                    if (iterator.temp.length > 0) {
                        iterator.temp.forEach((el) => {
                            groupData.push({ date: iterator.date, [el._id]: el.count });
                        });
                    } else {
                        groupData.push({
                            date: iterator.date,
                            [jobStatus.JOB_COMPLETED]: 0,
                            [jobStatus.JOB_PAUSED]: 0,
                            [jobStatus.JOB_STARTED]: 0,
                            [jobStatus.NOT_STARTED]: 0
                        });
                    }
                }
                // Initialize an object to hold the grouped data
                const groupedData = {};
    
                // Iterate through the input data
                groupData.forEach((item) => {
                    const { date, ...statusCounts } = item;
    
                    // If the date is not in the groupedData, initialize it
                    if (!groupedData[date]) {
                        groupedData[date] = {
                            date: date,
                            'JOB COMPLETED': 0,
                            'JOB PAUSED': 0,
                            'JOB STARTED': 0,
                            'NOT STARTED': 0
                        };
                    }
    
                    // Add the status counts to the corresponding date
                    Object.keys(statusCounts).forEach((status) => {
                        groupedData[date][status] += statusCounts[status];
                    });
                });
    
                // Convert the grouped data back to an array format
                const result = Object.values(groupedData);
    
                result.forEach((item) => {
                    keysToAdd.forEach((key) => {
                        if (!item.hasOwnProperty(key)) {
                            item[key] = 0;
                        }
                    });
                });
    
                barChart_data = [
                    {
                        data: result.map((item) => item['JOB COMPLETED']),
                        label: 'Job Completed'
                    },
                    {
                        data: result.map((item) => item['JOB PAUSED']),
                        label: 'Job Paused'
                    },
                    {
                        data: result.map((item) => item['JOB STARTED']),
                        label: 'Job Started'
                    },
                    {
                        data: result.map((item) => item['NOT STARTED']),
                        label: 'Job Not Started'
                    }
                ];
            }
    
            return res.json({
                Status: 'Success',
                Message: 'Graph Data retrived successfully',
                Data: { barChartLabels, barChart_data },
                Code: 200
            });
        } catch (error) {
            return res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    },
    /**
     * generate_pdf
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    Generatepdf : async (req, res) => {
        try {
            const pdfFilename = await generatePdf(req?.body);
            if (pdfFilename === 'false') {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'No Jobs Completed.Please Complete Jobs To Generate Report',
                    Data: {},
                    Code: 404
                });
            }
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Length': pdfFilename?.length,
                'Content-Disposition': `attachment; filename=${new Date().toISOString().split('T')[0]}.pdf`
            });
            res.sendFile(pdfFilename);
        } catch (err) {
            return res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    },
    /**
     * job list
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    MobileJoblist : async (req, res) => {
        try {
            const jobList = await JobManagementModel.aggregate([
                {
                    $match: {
                        $or: [
                            { activityId: new ObjectId(req.query.activityId) },
                            { subActivityId: new ObjectId(req.query.activityId) }
                        ]
                    }
                },
                {
                    $match: req.query.techNumber
                        ? {
                              techNumber: req.query.techNumber
                          }
                        : {}
                },
                {
                    $match:
                        req.query.status === jobStatus.JOB_COMPLETED
                            ? {
                                  jobStatus: jobStatus.JOB_COMPLETED
                              }
                            : { jobStatus: { $ne: jobStatus.JOB_COMPLETED } }
                }
            ]);
            return res.status(200).json({
                Status: 'Success',
                Message: 'Jobs retrieved successfully',
                Data: jobList,
                Code: 200
            });
        } catch (error) {
            console.error('Error fetching Jobs:', error);
            return res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    }

};

module.exports = JobManagementController;
