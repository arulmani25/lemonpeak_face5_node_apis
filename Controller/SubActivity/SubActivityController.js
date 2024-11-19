const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const Activity = require('../../Models/ActivityModel');
const SidebarItem = require('../../Models/SidebarModel');
const Subactivity = require('../../Models/SubactivityModel');
const CheckListModel = require('../../Models/ChecklistModel');

// Create a new subactivity
const SubActivityController = {
    /**
     * create SubActivity
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Create: async (req, res) => {
        try {
            if (!req.body.title || !req.body.description || !req.body.parentActivity) {
                return {
                    error: true,
                    message: 'Title, description, and parentActivity are required fields',
                    data: {}
                };
            }
            const activityData = await Activity.findOne({
                _id: req.body.parentActivity
            });
            if (!activityData) {
                return {
                    error: true,
                    message: 'Parent activity not exists',
                    data: {}
                };
            }

            const isExist = await CheckListModel.findOne({
                activity_id: activityData.activity_id
            });
            if (isExist) {
                return {
                    error: true,
                    message: 'Delete Activity Checklist To Create Sub-Activity',
                    data: {}
                };
            }
            const newSubactivity = await Subactivity.create(req.body);
            const parentActivitySidebarItem = await SidebarItem.findOne({
                link: `/activities/${req.body.parentActivity}`
            });

            if (!parentActivitySidebarItem) {
                return {
                    error: true,
                    message: 'Parent activity sidebar item not found',
                    data: {}
                };
            }
            parentActivitySidebarItem.subItems.push({
                title: newSubactivity.title,
                icon: 'icon',
                link: `/subactivities/${newSubactivity._id}`
            });
            return {
                error: false,
                message: 'Sub Activity Created Successfully',
                data: {}
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
     * update sub_activity
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Update: async (req, res) => {
        try {
            if (!req.body.title || !req.body.description || !req.body.parentActivity) {
                return {
                    error: true,
                    message: 'Title, description, and parentActivity are required fields',
                    data: {}
                };
            }
            const updatedSubactivity = await Subactivity.findByIdAndUpdate(req.body.id, req.body, { new: true });
            if (!updatedSubactivity) {
                return {
                    error: true,
                    message: 'Subactivity not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'Subactivity updated successfully',
                data: updatedSubactivity
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
     * get sub_activity list
     * @param {*} req
     * @param {*} res
     */
    List: async (req, res) => {
        try {
            const subactivities = await Subactivity.aggregate([
                {
                    $lookup: {
                        from: 'activities',
                        localField: 'parentActivity',
                        foreignField: '_id',
                        as: 'result'
                    }
                },
                {
                    $unwind: {
                        path: '$result',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        parentActivity: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        code: 1,
                        parentActivityTitle: '$result.title'
                    }
                }
            ]);
            return {
                error: false,
                message: 'Subactivities fetched successfully',
                data: subactivities
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
     * get sub_activity details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Details: async (req, res) => {
        try {
            const subactivity = await Subactivity.findById(req.params.id);
            if (!subactivity) {
                return {
                    error: true,
                    message: 'Subactivity not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'Subactivity fetched successfully',
                data: subactivity
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
     * delete sub_activity details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Delete: async (req, res) => {
        try {
            const deletedSubactivity = await Subactivity.findByIdAndDelete(req.params.id);
            if (!deletedSubactivity) {
                return {
                    return: true,
                    message: 'Subactivity not found',
                    date: {}
                };
            }
            return {
                error: false,
                message: 'Subactivity deleted successfully',
                data: deletedSubactivity
            };
        } catch (error) {
            return {
                error: 'Failed',
                message: 'Internal Server Error',
                data: {}
            };
        }
    }
};

module.exports = SubActivityController;
