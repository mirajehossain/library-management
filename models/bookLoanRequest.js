const mongoose = require('mongoose');

const { Schema } = mongoose;

const BookSchema = new Schema({
  bookId: { type: Schema.ObjectId, required: true, index: true },
  userId: {
    type: Schema.ObjectId, required: true, index: true,
  },
  requestDate: { type: Date, default: new Date() },
  status: {
    type: String, required: true, default: 'PENDING',
  },

}, { versionKey: false, timestamps: true });

module.exports = {
  BookModel: mongoose.model('BookLoanRequest', BookSchema),
};
