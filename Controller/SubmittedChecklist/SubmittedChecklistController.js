const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const SubmittedChecklistModel = require('../../Models/SubmitChecklistModel');
const jobManagementModel = require('../../Models/JobManagementModel');
const { jobStatus } = require('../../Helpers');

const JobManagementController = {
    /**
     * create jobmanagement
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Create: async (req) => {
        try {
            const existingJob = await SubmittedChecklistModel.findOne({
                job_id: req?.body?.job_id
            });
            if (existingJob) {
                return {
                    error: true,
                    message: 'checklist Already Submitted',
                    data: {}
                };
            }

            const submittedChecklist = await SubmittedChecklistModel.create(req.body);
            const updateJobStatus = await jobManagementModel.findOneAndUpdate(
                { job_id: req?.body?.jobId },
                { $set: { jobStatus: jobStatus.JOB_COMPLETED } }
            );
            return {
                error: false,
                message: 'CheckList Submitted successfully',
                data: submittedChecklist
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
     * get jobmanagement list
     * @param {*} req
     * @param {*} res
     * @returns
     */
    List: async (req, res) => {
        try {
            const submittedChecklist = await SubmittedChecklistModel.find({});
            return {
                error: false,
                message: 'Checklist retrieved successfully',
                data: submittedChecklist
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
     * get jobmanagement details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Details: async (req, res) => {
        try {
            const userType = await SubmittedChecklistModel.findById(req.params.id);
            if (!userType) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'checklist not found',
                    Data: {},
                    Code: 404
                });
            }
            return res.status(200).json({
                Status: 'Success',
                Message: 'Checklist retrieved successfully',
                Data: userType,
                Code: 200
            });
        } catch (error) {
            console.error('Error fetching checklist:', error);
            return res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    },
    /**
     * update jobmanagement details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Update: async (req, res) => {
        try {
            const updatedUserType = await SubmittedChecklistModel.findByIdAndUpdate(req.params.id, req.body, {
                new: true
            });
            if (!updatedUserType) {
                return {
                    error: true,
                    message: 'Checklist not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'checklist updated successfully',
                data: updatedUserType
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
     * delete jobmanagement
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Delete: async (req, res) => {
        try {
            const deletedCheklist = await SubmittedChecklistModel.findByIdAndDelete(req.params.id);
            if (!deletedCheklist) {
                return {
                    error: true,
                    message: 'checklist not found',
                    data: {}
                };
            }

            return {
                error: false,
                message: 'checklist deleted successfully',
                data: deletedCheklist
            };
        } catch (error) {
            return {
                error: true,
                message: 'Internal Server Error',
                data: {}
            };
        }
    },
    /**
     * check jobcompleted details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Submittedjob: async (req, res) => {
        try {
            const jobList = await jobManagementModel.find(
                {
                    jobStatus: jobStatus.JOB_COMPLETED
                },
                {},
                { sort: { createdAt: -1 } }
            );

            return {
                error: false,
                message: 'Submitted Job List retrieved successfully',
                data: jobList
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

module.exports = JobManagementController;
