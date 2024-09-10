const {
    createActivity,
    findOneActivity,
    findActicity,
    deleteActivity,
    updateActivity
} = require('../../Repositary/activityrepositary');
const { todayDate, endDate, dateFinder, getNanoId, isEmpty } = require('../../Helpers/Utils');
const SidebarModel = require('../../Models/SidebarModel');

const ActivityController = {
    /**
     * create activity
     * @param {*} requestData
     * @returns
     */
    Create: async (requestData) => {
        try {
            if (!requestData?.title || !requestData?.description || !requestData?.index) {
                return {
                    error: 'Failed',
                    message: 'title, description, and index are required fields',
                    data: {}
                };
            }
            const existingActivity = await findOneActivity({ index: requestData?.index });
            if (existingActivity) {
                return {
                    error: 'Failed',
                    message: 'duplicate index found. Please choose a unique index.',
                    data: {}
                };
            }
            let requestObjrect = {
                activity_id: getNanoId(),
                title: requestData?.title,
                code: requestData?.code,
                description: requestData?.description,
                date: requestData?.date,
                status: requestData?.status,
                index: requestData?.index
            };
            const newActivity = await createActivity(requestObjrect);
            if (isEmpty(newActivity)) {
                return {
                    error: true,
                    message: 'activity data is not saved properly',
                    data: undefined
                };
            }
            const Sidebaritem = new SidebarModel({
                title: requestData?.title,
                icon: 'icon',
                link: `/activities/${newActivity.activity_id}`,
                order: requestData?.index
            });
            await Sidebaritem.save();
            return {
                error: false,
                message: 'activity created successfully',
                data: newActivity
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
     *list
     * @param {*} query
     * @param {*} activity_id
     * @returns
     */
    List: async (query, activity_id) => {
        try {
            let queryObject = {};
            let limit = query?.limit ? Number.parseInt(query?.limit) : 20;
            let page = query?.page ? Number.parseInt(query?.page) : 1;

            if (query?.activity_id) queryObject['activity_id'] = query?.activity_id;
            if (query?.status) queryObject['status'] = query?.status;
            if (query?.user_role) queryObject['description.user_role'] = query?.user_role;
            if (query?.from_date || query?.to_date || query.date_option) {
                queryObject['createdAt'] = dateFinder(query);
            }
            if (activity_id) {
                queryObject['activity_id'] = activity_id;
            }
            let projection = {
                _id: 0,
                __v: 0
            };
            let complaintData = await ComplaintModel.find(queryObject, projection)
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ _id: -1 })
                .lean();
            if (isEmpty(complaintData)) {
                return {
                    error: true,
                    message: 'Complaint list is not found',
                    data: undefined
                };
            }
            return {
                error: false,
                message: 'Complaint list',
                data: complaintData
            };
        } catch (error) {
            return {
                error: error,
                message: 'Activity list is not available',
                data: undefined
            };
        }
    },
    /**
     * details
     * @param {*} queryData
     * @returns
     */
    Details: async (queryData) => {
        console.log(queryData);
        if (isEmpty(queryData)) {
            return {
                error: true,
                message: 'activity_id is not empty',
                data: undefined
            };
        }
        let result = await findOneActivity({ activity_id: queryData });
        console.log('result', result);
        try {
            if (isEmpty(result)) {
                return {
                    error: true,
                    message: 'activity details is not found',
                    data: undefined
                };
            } else {
                return {
                    error: false,
                    message: 'Activity details are.',
                    data: result
                };
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            };
        }
    },
    /**
     * update activity
     * @param { } requestData
     * @returns
     */
    Update: async (requestData) => {
        try {
            if (isEmpty(requestData)) {
                return {
                    error: true,
                    message: 'activity data is not empty',
                    data: undefined
                };
            }
            if (!requestData?.title || !requestData?.description || !requestData?.index) {
                return {
                    Status: 'Failed',
                    message: 'Title, description, and index are required fields',
                    data: {}
                };
            } else {
                const activity = await findOneActivity({ activity_id: requestData?.activity_id });
                if (isEmpty(activity)) {
                    return {
                        error: true,
                        message: 'activity data is not found',
                        data: undefined
                    };
                }
                let requestObject = {
                    activity_id: requestData?.activity_id ?? activity?.activity_id,
                    title: requestData?.title ?? activity?.title,
                    description: requestData?.description ?? activity?.description,
                    index: requestData?.index ?? activity?.index
                };
                let UpateResult = await updateActivity(requestObject);
                if (!isEmpty(UpateResult)) {
                    return {
                        error: false,
                        message: 'activity updated successful',
                        data: UpateResult
                    };
                } else {
                    return {
                        error: true,
                        message: 'activity is not updated',
                        data: undefined
                    };
                }
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            };
        }
    },
    /**
     * delete activity
     * @param {*} activity_id
     * @returns
     */
    Delete: async (activity_id) => {
        console.log(activity_id);
        console.log(1234);
        try {
            if (isEmpty(activity_id)) {
                return { error: true, message: 'Unauthorized access.' };
            }
            let activity = await findActicity({ activity_id: activity_id });
            if (isEmpty(activity)) {
                return { error: false, message: 'Invalid Activity!' };
            } else {
                let activity = await findActicity({ activity_id: activity_id });
                let deleteProduct = await deleteActivity({ activity_id: activity?.activity_id });
                if (deleteProduct) {
                    return { error: false, data: {}, message: 'Product deleted successfully!' };
                }
                return { error: false, data: {}, message: 'Something went wrong!' };
            }
        } catch (error) {}
    }
};

module.exports = ActivityController;