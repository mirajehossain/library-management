const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  userType: { type: String, required: true },
  name: {
    type: String, trim: true, required: true, index: true,
  },
  email: {
    type: String, trim: true, required: true, index: true,
  },
  password: {
    type: String, required: false,
  },
  mobile: {
    type: String, trim: true,
  },
  image: { type: String, required: false },

}, { versionKey: false, timestamps: true });

module.exports = {
  UserModel: mongoose.model('User', UserSchema),
};
