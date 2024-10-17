const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const AccessConfigSchema = new mongoose.Schema({
    access_config_id: { type: String },
    access_config: { type: String },
    user_type_id: { type: String, ref: 'UserType' },
    sideBar: [
        {
            title: { type: String },
            read: { type: Boolean, default: false },
            write: { type: Boolean, default: false }
        }
    ]
});
AccessConfigSchema.plugin(timestamps);
const AccessConfig = mongoose.model('AccessConfig', AccessConfigSchema);
module.exports = AccessConfig;
