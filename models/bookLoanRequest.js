const mongoose = require('mongoose');
const { bookRequestStatus } = require('../config/constants');

const { Schema } = mongoose;

const BookSchema = new Schema({
  bookId: { type: Schema.ObjectId, required: true, index: true },
  userId: {
    type: Schema.ObjectId, required: true, index: true,
  },
  requestDate: { type: Date, default: new Date() },
  status: {
    type: String, default: bookRequestStatus.pending,
  },

}, { versionKey: false, timestamps: true });

module.exports = {
  BookLoanRequestModel: mongoose.model('BookLoanRequest', BookSchema),
};
