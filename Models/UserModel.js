const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const UserSchema = new mongoose.Schema({
    user_id: { type: String },
    clientId: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    phoneNumber: { type: String, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fcm_token: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    user_type_id: { type: String }
});
UserSchema.plugin(timestamps);
const User = mongoose.model('User', UserSchema);

module.exports = User;
