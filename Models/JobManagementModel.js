const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const JobDetailsSchema = new mongoose.Schema({
    job_deteils_id: { type: String },
    jobTitle: { type: String },
    jobId: { type: String },
    description: { type: String },
    client_id: { type: String },
    site_id: { type: String },
    activity_id: { type: String },
    sub_activity_id: {
        type: String
    },
    submitted_checklist_id: {
        type: String
    },
    jobDate: { type: Date },
    jobStatus: {
        type: String,
        enum: ['NOT STARTED', 'JOB STARTED', 'JOB PAUSED', 'JOB PAUSED', 'JOB COMPLETED'],
        default: 'NOT STARTED'
    },
    jobAddress: {
        address: { type: String },
        lat: { type: Number },
        lng: { type: Number }
    },
    contactNumber: { type: String },
    contactName: { type: String },
    techName: { type: String },
    techNumber: { type: String },
    is_master: { type: Boolean, default: false }
});
JobDetailsSchema.plugin(timestamps);
const jobManagementModel = mongoose.model('jobDetails', JobDetailsSchema);

module.exports = jobManagementModel;
