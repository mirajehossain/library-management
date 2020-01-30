const mongoose = require('mongoose');

const { Schema } = mongoose;

const BookSchema = new Schema({
  bookType: { type: String, required: true },
  title: {
    type: String, trim: true, required: true,
  },
  authorId: {
    type: Schema.ObjectId, required: true, index: true,
  },
  publications: {
    type: String, trim: true, required: true,
  },

}, { versionKey: false, timestamps: true });

module.exports = {
  BookModel: mongoose.model('Book', BookSchema),
};
