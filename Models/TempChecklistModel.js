const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const Temp_checklistSchema = new mongoose.Schema({
    temp_checklist_id: { type: String },
    job_deteils_id: { type: String },
    data_store: [
        {
            index: { type: Number },
            field_name: { type: String },
            field_type: { type: String },
            field_length: { type: String },
            field_comments: { type: String },
            field_value: { type: String },
            drop_down: { type: Array },
            field_update_reason: { type: String },
            date_of_create: { type: Date },
            date_of_update: { type: Date },
            // created_by: { type: objectId },
            // updated_by: { type: objectId },
            activity_id: { type: String },
            sub_activity_id: { type: String },
            delete_status: { type: Boolean },
            field_required: { type: Boolean }
        }
    ]
});
Temp_checklistSchema.plugin(timestamps);
const tempChecklistModel = mongoose.model('tempChecklist', Temp_checklistSchema);

module.exports = tempChecklistModel;
