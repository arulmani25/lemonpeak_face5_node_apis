const Express = require('express');
const Router = Express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const CheckListModel = require('../../Models/ChecklistModel');
const { isEmpty, getNanoId, dateFinder } = require('../../Helpers/Utils');
const { findOneActivity } = require('../../Repositary/activityrepositary');
const { createChecklist, findChecklist, deleteChecklist } = require('../../Repositary/Checklistrepositary');

const CheckList = {
    /**
     * Create CheckList
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Create: async (requestData) => {
        try {
            // Define projection to exclude unnecessary fields
            const projection = {
                __v: 0,
                updatedAt: 0,
                createdAt: 0,
                date: 0
            };
            // Check if the activity exists
            let getActivity;
            let checlisttypeObject = {};
            if (requestData?.main_activity_id) {
                getActivity = await findOneActivity({ activity_id_id: requestData?.activity_id }, projection);
                if (isEmpty(getActivity)) {
                    return {
                        error: true,
                        message: 'Activity not found',
                        data: {}
                    };
                }
                checlisttypeObject = {
                    name: 'activity',
                    activity_id: getActivity?.activity_id
                };
            }
            // Check if the equipment exists
            let getEquipment;
            if (requestData?.equipment_id) {
                getEquipment = await findOneEquipments({ equipment_id: requestData?.equipment_id }, projection);
                if (isEmpty(getEquipment)) {
                    return {
                        error: true,
                        message: 'Equipment not found',
                        data: {}
                    };
                }
                checlisttypeObject = {
                    name: 'equipment',
                    equipment_id: getEquipment?.equipment_id,
                    frequency: requestData?.frequency
                };
            }
            // Find existing checklist data
            const Checklistdata = await findChecklist(
                {
                    $and: [
                        { 'check_list_type.activity_id': requestData.activity_id },
                        { 'check_list_type.equipment_id': requestData.equipment_id },
                        { 'check_list_type.checked_to': requestData.frequency }
                    ],
                    index: requestData.index
                },
                {
                    projection: { __v: 0 }
                }
            );
            // Create new checklist if not found
            if (isEmpty(Checklistdata)) {
                const requestObject = {
                    checklist_id: getNanoId(),
                    index: requestData.index ?? 0,
                    field_name: requestData.field_name ?? '',
                    field_type: requestData.field_type ?? '',
                    field_length: requestData.field_length ?? '',
                    field_comments: requestData.field_comments ?? '',
                    field_value: requestData.field_value ?? '',
                    drop_down: requestData.drop_down ?? [],
                    field_update_reason: requestData.field_update_reason ?? '',
                    created_by: requestData.created_by,
                    updated_by: requestData.updated_by,
                    main_activity_id: requestData.main_activity_id,
                    sub_activity_id: requestData.sub_activity_id,
                    delete_status: requestData.delete_status ?? false,
                    field_required: requestData.field_required,
                    check_list_type: checlisttypeObject
                };
                const newCheckList = await createChecklist(requestObject);
                return {
                    error: false,
                    message: 'Checklist created successfully',
                    data: newCheckList
                };
            } else {
                return {
                    error: true,
                    message: 'Duplicate index checklist found. Please choose a unique index.',
                    data: {}
                };
            }
        } catch (error) {
            return {
                error: true,
                messsage: error.message,
                data: {}
            };
        }
    },
    /**
     * get all checklist
     * @param {*} req
     * @param {*} res
     */
    List: async (request) => {
        try {
            let query = request?.query;
            let checklist_id = request?.params?.checklistId;
            let queryObject = {};

            // let limit = query?.limit ? Number.parseInt(query?.limit) : 20;
            // let page = query?.page ? Number.parseInt(query?.page) : 1;

            if (query?.checklist_id) queryObject['checklist_id'] = query?.checklist_id;
            if (query?.field_name) queryObject['field_name'] = query?.field_name;
            if (query?.delete_status) queryObject['delete_status'] = query?.delete_status;
            if (query?.field_type) queryObject['field_type'] = query?.field_type;
            if (query?.checklist_type_name) queryObject['check_list_type.name'] = query?.checklist_type_name;
            if (query?.activity_id) queryObject['check_list_type.activity_id'] = query?.activity_id;
            if (query?.equipment_id) queryObject['check_list_type.equipment_id'] = query?.equipment_id;
            if (query?.equipment_tag) queryObject['check_list_type.equipment_tag'] = query?.equipment_tag;
            if (query?.frequency) queryObject['check_list_type.frequency'] = query?.frequency;

            if (query?.from_date || query?.to_date || query.date_option) {
                queryObject['createdAt'] = dateFinder(query);
            }
            if (checklist_id) {
                queryObject['checklist_id'] = checklist_id;
            }
            let projection = {
                __v: 0,
                _id: 0
            };
            let checklistData = await CheckListModel.find(queryObject, projection)
                // .limit(limit)
                // .skip((page - 1) * limit)
                .lean();
            if (isEmpty(checklistData)) {
                return {
                    error: true,
                    message: 'Check_list is not found',
                    data: undefined
                };
            }
            return {
                error: false,
                message: 'Check_list data are',
                data: checklistData
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
     * find checklist details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Details: async (checklistID) => {
        try {
            if (isEmpty(checklistID)) {
                return {
                    error: true,
                    message: 'Checklist_id is not empty',
                    data: undefined
                };
            }
            let result = await findChecklist({ checklist_id: checklistID });
            if (isEmpty(result)) {
                return {
                    error: true,
                    message: 'Checklist details is not found',
                    data: undefined
                };
            }
            return {
                error: false,
                message: 'Checklist details are.',
                data: result
            };
        } catch (error) {
            return {
                error: true,
                message: error.message,
                data: undefined
            };
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
     * delete checklist
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Delete: async (checklistID) => {
        try {
            const DeleteChecklist = await deleteChecklist({ checklist_id: checklistID });
            if (!DeleteChecklist) {
                return {
                    error: true,
                    message: 'checklist not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'checklist deleted successfully',
                data: DeleteChecklist
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
     * get checklist list in mobile
     * @param {*} req
     * @param {*} res
     * @returns
     */
    GetMobileChecklist: async (req, res) => {
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
