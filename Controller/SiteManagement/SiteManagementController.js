const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const SiteManagementModel = require('../../Models/SiteManagementModel');

const SiteManagementController = {
    /**
     * create sitemanagement
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Create: async (requestValue, res) => {
        try {
            if (!requestValue?.body?.clientId || !requestValue?.body?.siteName) {
                return {
                    error: true,
                    message: 'clientId is required field',
                    data: {}
                };
            }
            const newSite = await SiteManagementModel.create(requestValue?.body);
            return {
                error: false,
                message: 'Site created successfully',
                data: newSite
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
     * get sitemanagement list
     * @param {*} req
     * @param {*} res
     * @returns
     */
    List: async (req, res) => {
        try {
            const { searchKey, skip, limit, sortkey, sortOrder, clientId } = req.query;

            const sort = {
                [sortkey ? sortkey : 'createdAt']: !sortOrder || sortOrder === 'DESC' ? -1 : 1
            };

            const searchRegex = new RegExp(['^.*', searchKey, '.*$'].join(''), 'i');

            const siteList = await SiteManagementModel.aggregate([
                {
                    $match: clientId ? { client_id: clientId } : {}
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
                        data: [{ $skip: Number(skip) || 0 }, { $limit: Number(limit) || 10 }]
                    }
                }
            ]);
            return {
                error: false,
                message: 'Sites retrieved successfully',
                data: siteList
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
     * get sitemanagement details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Details: async (req, res) => {
        try {
            const siteInfo = await SiteManagementModel.findById(req.params.id);
            if (!siteInfo) {
                return {
                    error: true,
                    message: 'Site not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'Site retrieved successfully',
                data: siteInfo
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
     * delete sitemanagement details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Delete: async (req, res) => {
        try {
            const removeSite = await SiteManagementModel.findByIdAndDelete(req.params.id);
            if (!removeSite) {
                return {
                    error: true,
                    message: 'Site not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'Site deleted successfully',
                data: removeSite
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
     * update sitemanagement details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Update: async (req, res) => {
        try {
            const updateSite = await SiteManagementModel.findByIdAndUpdate(req.body.id, req.body, {
                new: true
            });
            if (!updateSite) {
                return {
                    error: true,
                    message: 'Site not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'Site updated successfully',
                data: updateSite
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

module.exports = SiteManagementController;
