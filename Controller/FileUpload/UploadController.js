const express = require('express');
const Router = express.Router();
const moment = require('moment');
const bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({ extended: false }));
Router.use(bodyParser.json());

const FileUpload = {
    /**
     * file upload
     * @param {*} req
     * @param {*} res
     * @returns
     */
    Upload: async (requestData, res) => {
        const payload = requestData?.files;
        if (Object.keys(payload?.files).length == 0) {
            return {
                error: true,
                message: 'No files were uploaded.',
                data: {}
            };
        }

        const sampleFile = payload?.files;
        const filePath = [];
        if (sampleFile.length > 1) {
            sampleFile.forEach((element) => {
                const time_details = moment().format('YYYYMMDDHHmmss');
                var path = 'upload/' + time_details + '_' + element.name;
                element.mv(path, async function (err) {
                    if (err) return err;
                });
                filePath.push(path);
            });
        } else {
            const time_details = moment().format('YYYYMMDDHHmmss');
            var path = 'upload/' + time_details + '_' + req.body.title + '.' + sampleFile.name.split('.').at(1);
            sampleFile.mv(path, async function (err) {
                if (err) return err;
            });
            filePath.push(path);
        }
        return {
            error: true,
            message: 'Upload success',
            data: filePath
        };
    }
};

module.exports = FileUpload;
