const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const ActivitySchema = new mongoose.Schema({
    activity_id: { type: String },
    title: { type: String, required: true },
    code: { type: String, unique: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'active' },
    index: { type: Number, required: true, unique: true }
});
ActivitySchema.plugin(timestamps);
const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;
