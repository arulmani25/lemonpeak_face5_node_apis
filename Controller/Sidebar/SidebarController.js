const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());
const mongoose = require('mongoose');

const SidebarModel = require('../../Models/SidebarModel');
const AccessConfigModel = require('../../Models/AccessConfigModel');
const UserTypeModel = require('../../Models/UserTypeModel');

const SidebarController = {
    /**
     * create sidebar
     * @param {*} req
     * @param {*} res
     */
    Create: async (requestData) => {
        try {
            const newSidebarItem = await SidebarModel.create(requestData);
            return {
                error: false,
                message: 'Sidebar item created successfully',
                data: newSidebarItem
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
     * get sidebar Details
     * @param {*} req
     * @param {*} res
     */
    List: async (req, res) => {
        try {
            const getIdByRole = await UserTypeModel.findOne({
                name: req.loggedUser.user_type
            });
            const getConfigs = await AccessConfigModel.findOne({
                user_type_id: getIdByRole.user_type_id
            });

            const sideBarItems = [];

            for (const iterator of getConfigs.sideBar) {
                if (iterator.read) {
                    sideBarItems.push(iterator.title);
                }
            }
            const sidebarItems = await SidebarModel.find({
                title: { $in: sideBarItems }
            });
            return {
                error: false,
                message: 'Sidebar items fetched successfully',
                data: sidebarItems
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
     * SidebarItemsList
     * @param {*} req
     * @param {*} res
     * @returns
     */
    SidebarItemsList: async (req, res) => {
        try {
            const sidebarItem = await SidebarModel.find();
            if (!sidebarItem) {
                return {
                    error: true,
                    message: 'Sidebar item not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'Sidebar item fetched successfully',
                data: sidebarItem
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
     * get details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Details: async (req, res) => {
        try {
            const sidebarItem = await SidebarModel.findById(req.params.id);
            if (!sidebarItem) {
                return {
                    error: true,
                    message: 'Sidebar item not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'Sidebar item fetched successfully',
                data: sidebarItem
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
     * update sudebar details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Update: async (req, res) => {
        try {
            const updatedSidebarItem = await SidebarModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedSidebarItem) {
                return {
                    error: true,
                    message: 'Sidebar item not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'Sidebar item updated successfully',
                data: updatedSidebarItem
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
     * delete sidebar
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Delete: async (req, res) => {
        try {
            const deletedSidebarItem = await SidebarModel.findByIdAndDelete(req.params.id);
            if (!deletedSidebarItem) {
                return {
                    error: true,
                    message: 'Sidebar item not found',
                    data: {}
                };
            }
            return {
                error: false,
                message: 'Sidebar item deleted successfully',
                data: deletedSidebarItem
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

module.exports = SidebarController;
