const timestamps = require('mongoose-timestamp');
const mongoose = require('mongoose');

const SubmittedChecklistSchema = new mongoose.Schema({
    submitted_checklist_id: { type: String },
    job_deteils_id: { type: String },
    start_time: { type: String },
    end_time: { type: String },
    submittedData: [
        {
            field_name: { type: String },
            field_value: { type: String }
        }
    ],
    images: [],
    is_active: { type: Boolean, default: true },
    user_id: { type: String },
    jobInfo: { type: Object }
});
SubmittedChecklistSchema.plugin(timestamps);

const SubmittedCheckList = mongoose.model('submittedChecklist', SubmittedChecklistSchema);
module.exports = SubmittedCheckList;
