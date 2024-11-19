const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const tempChecklistModel = require('../../Models/TempChecklistModel');

const TempChecklistController = {
    /**
     * create temp_checklist
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Create: async (request) => {
        try {
            let record;
            const payload = request?.body;
            const isJobExists = await tempChecklistModel.findOne({
                job_deteils_id: payload.job_deteils_id
            });
            if (isJobExists) {
                record = await tempChecklistModel.findOneAndUpdate(
                    { job_deteils_id: isJobExists.job_id },
                    { data_store: [...payload.data_store] }
                );
                return {
                    error: false,
                    message: 'temp checklist stored successfully',
                    data: record
                };
            } else {
                record = await tempChecklistModel.create({
                    ...payload
                });
                return {
                    error: false,
                    message: 'temp checklist stored successfully',
                    data: record
                };
            }
        } catch (error) {
            return {
                error: true,
                message: error.message,
                data: {}
            };
        }
    },
    /**
     * list of temp_checklist
     * @param {*} req
     * @param {*} res
     */
    List: async (req, res) => {
        try {
            const checkLists = await tempChecklistModel.find();
            return {
                error: false,
                message: 'checklist fetched successfully',
                data: checkLists
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
     * details of temp_checklist
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Details: async (req) => {
        try {
            const checklistById = await tempChecklistModel.findOne({
                job_details_id: req?.params?.id
            });
            if (!checklistById) {
                return {
                    error: true,
                    message: 'temp checklist not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'temp checklist fetched successfully',
                data: checklistById
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
     * update temp_checklistdetails
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Update: async (req, res) => {
        try {
            const updatedChecklist = await tempChecklistModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedChecklist) {
                return {
                    error: true,
                    message: 'checklist not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'checklist updated successfully',
                data: updatedChecklist
            };
        } catch (error) {
            return {
                error: 'Failed',
                message: 'Internal Server Error',
                data: {}
            };
        }
    },
    /**
     * delete temp_checklist
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Delete: async (req, res) => {
        try {
            const deleteChecklist = await tempChecklistModel.findByIdAndDelete(req.params.id);
            if (!deleteChecklist) {
                return {
                    error: true,
                    message: 'checklist not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'checklist deleted successfully',
                data: deleteChecklist
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

module.exports = TempChecklistController;
