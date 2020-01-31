const mongoose = require('mongoose');

const { Schema } = mongoose;

const BookSchema = new Schema({
  bookId: { type: Schema.ObjectId, required: true, index: true },
  userId: {
    type: Schema.ObjectId, required: true, index: true,
  },
  loanDate: { type: Date, default: new Date() },
  isReturned: {
    type: Boolean, default: false,
  },
  returnedAt: { type: Date },

}, { versionKey: false, timestamps: true });

module.exports = {
  BookLoanModel: mongoose.model('BookLoan', BookSchema),
};
