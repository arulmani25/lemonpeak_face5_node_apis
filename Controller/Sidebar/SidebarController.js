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
    create: async (req, res) => {
        try {
            const newSidebarItem = await SidebarModel.create(req.body);
            res.status(201).json({
                Status: 'Success',
                Message: 'Sidebar item created successfully',
                Data: newSidebarItem,
                Code: 201
            });
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
                role: new mongoose.Types.ObjectId(getIdByRole._id)
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
            res.json({
                Status: 'Success',
                Message: 'Sidebar items fetched successfully',
                Data: sidebarItems,
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
     * SidebarItemsList
     * @param {*} req
     * @param {*} res
     * @returns
     */
    SidebarItemsList: async (req, res) => {
        try {
            const sidebarItem = await SidebarModel.find();
            if (!sidebarItem) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'Sidebar item not found',
                    Data: {},
                    Code: 404
                });
            }
            res.json({
                Status: 'Success',
                Message: 'Sidebar item fetched successfully',
                Data: sidebarItem,
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
     * get details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Details: async (req, res) => {
        try {
            const sidebarItem = await SidebarModel.findById(req.params.id);
            if (!sidebarItem) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'Sidebar item not found',
                    Data: {},
                    Code: 404
                });
            }
            res.json({
                Status: 'Success',
                Message: 'Sidebar item fetched successfully',
                Data: sidebarItem,
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
     * update sudebar details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Update: async (req, res) => {
        try {
            const updatedSidebarItem = await SidebarModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedSidebarItem) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'Sidebar item not found',
                    Data: {},
                    Code: 404
                });
            }
            res.json({
                Status: 'Success',
                Message: 'Sidebar item updated successfully',
                Data: updatedSidebarItem,
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
     * delete sidebar
     * @param {*} req
     * @param {*} res
     * @returns
     */
    DeleteSidebarItem: async (req, res) => {
        try {
            const deletedSidebarItem = await SidebarModel.findByIdAndDelete(req.params.id);
            if (!deletedSidebarItem) {
                return res.status(404).json({
                    Status: 'Failed',
                    Message: 'Sidebar item not found',
                    Data: {},
                    Code: 404
                });
            }
            res.json({
                Status: 'Success',
                Message: 'Sidebar item deleted successfully',
                Data: deletedSidebarItem,
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

module.exports = SidebarController;
