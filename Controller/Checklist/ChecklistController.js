const Express = require('express');
const Router = Express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const CheckListModel = require('../../Models/ChecklistModel');

const CheckList = {
    /**
     * Create CheckList
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    createCheckList : async (req, res) => {
        try {
            let Checklistdata = await CheckListModel.findOne({
                $and: [{ main_activity_id: req?.body?.main_activity_id }, { index: req?.body?.index }]
            });
            if (!Checklistdata) {
                const newCheckList = await CheckListModel.create(req.body);
                res.status(201).json({
                    Status: 'Success',
                    Message: 'checklist created successfully',
                    Data: newCheckList,
                    Code: 201
                });
            } else {
                return res.status(409).json({
                    Status: 'Failed',
                    Message: 'Duplicate index checklist foundin. Please choose a unique index.',
                    Data: {},
                    Code: 409
                });
            }
        } catch (error) {
            console.log('=======error', error);
            res.status(500).json({
                Status: 'Failed',
                Message: 'Internal Server Error',
                Data: {},
                Code: 500
            });
        }
    },
    /**
     * get all checklist
     * @param {*} req 
     * @param {*} res 
     */
    List : async (req, res) => {
        try {
            const checkLists = await CheckListModel.find();
            res.json({
                Status: 'Success',
                Message: 'checklist fetched successfully',
                Data: checkLists,
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
     * find checklist details
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    Details : async (req, res) => {
        try {
            const checklistById = await CheckListModel.aggregate([
                {
                    $match: req.query.sub_activity_id
                        ? {
                              sub_activity_id: new ObjectId(req.query.sub_activity_id),
                              main_activity_id: new ObjectId(req.query.main_activity_id)
                          }
                        : {
                              main_activity_id: new ObjectId(req.query.main_activity_id),
                              sub_activity_id: { $exists: false }
                          }
                }
            ]);
            if (!checklistById) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'checklist not found',
                    Data: {},
                    Code: 404
                });
            }
            res.json({
                Status: 'Success',
                Message: 'checklist fetched successfully',
                Data: checklistById,
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
     * update checklist details
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    Update: async (req, res) => {
        try {
            const updatedChecklist = await CheckListModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedChecklist) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'checklist not found',
                    Data: {},
                    Code: 404
                });
            }
            res.json({
                Status: 'Success',
                Message: 'checklist updated successfully',
                Data: updatedChecklist,
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
     * delete checklist details
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    DeleteChecklist : async (req, res) => {
        try {
            const deleteChecklist = await CheckListModel.findByIdAndDelete(req.params.id);
            if (!deleteChecklist) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'checklist not found',
                    Data: {},
                    Code: 404
                });
            }
            res.json({
                Status: 'Success',
                Message: 'checklist deleted successfully',
                Data: deleteChecklist,
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
     * get checklist list in mobile
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    GetMobileChecklist : async (req, res) => {
        try {
            const checklistById = await CheckListModel.find({
                $or: [
                    { main_activity_id: new ObjectId(req.query.activityId) },
                    { sub_activity_id: new ObjectId(req.query.activityId) }
                ]
            });
            if (!checklistById) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'checklist not found',
                    Data: {},
                    Code: 404
                });
            }
            res.json({
                Status: 'Success',
                Message: 'checklist fetched successfully',
                Data: checklistById,
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
    }
};

module.exports = CheckList;
