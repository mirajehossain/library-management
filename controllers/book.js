const { bookType, bookRequestStatus } = require('../config/constants');
const { BookModel } = require('../models/book');
const response = require('../helpers/response');


module.exports = {
  async createBook(req, res) {
    try {
      const payload = req.body;
      const book = await BookModel.findOne({ title: payload.title });
      if (!book) {
        const newBook = await BookModel.create(payload);
        return res.status(200).send(response.success('New book created!', { ...newBook.toObject() }));
      }
      return res.status(200).send(response.success('Book tite already exist, book title can not be duplicate!', {}, false));
    } catch (e) {
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async updateBook(req, res) {
    try {
      const { bookId } = req.params;
      const payload = req.body;
      const book = await BookModel.findOne({ _id: bookId }).lean();

      if (book) {
        const updatedBook = await BookModel
          .findOneAndUpdate({ _id: bookId }, payload, { new: true });
        return res.status(200).send(response.success('Book successfully updated!', { ...updatedBook.toObject() }));
      }
      return res.status(200).send(response.success('Book not found', {}, false));
    } catch (e) {
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async deleteBook(req, res) {
    try {
      const { bookId } = req.params;
      const book = await BookModel.findOne({ _id: bookId }).lean();
      if (book) {
        await BookModel.findOneAndRemove({ _id: bookId });
        return res.status(200).send(response.success('Book successfully deleted!', { }));
      }
      return res.status(200).send(response.success('Book not found', {}, false));
    } catch (e) {
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getBooks(req, res) {
    try {
      const { pageNo = 1 } = req.params;
      const { author } = req.query;
      const perPage = 20;
      const skip = perPage * (pageNo - 1);
      const limit = skip + perPage;
      let books;
      if (author) {
        books = await BookModel.find({ authorName: author }).skip(skip).limit(limit);
      } else {
        books = await BookModel.find({ authorName: author }).skip(skip).limit(limit);
      }

      return res.status(200).send(response.success('Book lists', books));
    } catch (e) {
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },
};
