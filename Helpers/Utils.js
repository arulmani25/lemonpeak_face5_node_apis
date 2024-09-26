const { customAlphabet } = require('nanoid');
const moment = require('moment');
// const Request = require('request');

const Utils = {
    /**
     * getNanoId
     * @returns
     */
    getNanoId: () => {
        let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
        let randomId = customAlphabet(alphabet, 12);
        return randomId();
    },

    /**
     * Integer Value
     * @returns
     */
    number: () => {
        let alphabet = '1234567890';
        let uniqueId = customAlphabet(alphabet, 12);
        return uniqueId();
    },

    /**
     * Today Date
     * @returns
     */
    todayDate: () => {
        return moment().format('YYYY-MM-DD');
    },

    /**
     * End Date
     * @returns
     */
    endDate: () => {
        let endDate = moment().subtract(1, 'day').add(1, 'year').format('YYYY-MM-DD');
        return endDate;
    },
    /**
     * Function for checking whether the data is empty
     * @param data
     * @returns {boolean}
     */
    isEmpty: (data) => {
        if (data === null || data === undefined) {
            return true;
        }
        if (typeof data === 'string' && data.replace(/ /g, '').length > 0) {
            return false;
        }
        if (typeof data === 'number') {
            return false;
        }
        if (typeof data === 'boolean') {
            return false;
        }
        if (Array.isArray(data) && data.length > 0) {
            return false;
        }
        if (typeof data === 'object' && Object.keys(data).length > 0) {
            return false;
        }
        return true;
    },
    /***
     * date option
     */
    dateFinder: (data) => {
        let query = {};
        let toDate = moment().endOf('day').toDate();
        let previousDay = moment().startOf('day').subtract(1, 'day').toDate();
        let thisWeek = moment().startOf('week').toDate();
        let thisMonth = moment().startOf('month').toDate();
        let thisYear = moment().startOf('year').toDate();

        if (data?.date_option) {
            let fromDate;
            switch (data?.date_option) {
                case 'weekly': {
                    fromDate = thisWeek;
                    query = { $gte: fromDate, $lte: toDate };
                    break;
                }
                case 'monthly': {
                    fromDate = thisMonth;
                    query = { $gte: fromDate, $lte: toDate };
                    break;
                }
                case 'yearly': {
                    fromDate = thisYear;
                    query = { $gte: fromDate, $lte: toDate };
                    break;
                }
                case 'yesterday': {
                    fromDate = previousDay;
                    toDate = moment().endOf('day').subtract(1, 'day').toDate();
                    query = { $gte: fromDate, $lt: toDate };
                    break;
                }
                default: {
                    fromDate = new Date(moment().startOf('day'));
                    query = { $gte: fromDate, $lte: toDate };
                    break;
                }
            }
        }
        if (data?.from_time) {
            let startTime = new Date(data?.from_time);
            startTime.setHours('00');
            startTime.setMinutes('00');
            startTime.setSeconds('00');
            query = { $gte: startTime };
        }

        if (data?.to_time) {
            let endTime = new Date(data?.to_time);
            endTime.setHours('23');
            endTime.setMinutes('59');
            endTime.setSeconds('59');
            query = { $lte: endTime };
        }

        if (data?.from_time && data?.to_time) {
            let startTime = new Date(data?.from_time);
            startTime.setHours('00');
            startTime.setMinutes('00');
            startTime.setSeconds('00');

            let endTime = new Date(data?.to_time);
            endTime.setHours('23');
            endTime.setMinutes('59');
            endTime.setSeconds('59');

            query = { $gte: startTime, $lt: endTime };
        }
        return query;
    }
};

module.exports = Utils;
