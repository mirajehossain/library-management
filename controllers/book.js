const { ObjectId } = require('mongoose').Types;
const { bookType, bookRequestStatus } = require('../config/constants');
const { BookModel } = require('../models/book');
const { BookLoanRequestModel } = require('../models/bookLoanRequest');
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

  async requestForBook(req, res) {
    try {
      const payload = req.body; // bookId, userId
      const request = await BookLoanRequestModel.create(payload);
      return res.status(200).send(response.success('New book request created', request));
    } catch (e) {
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async updateBookRequest(req, res) {
    try {
      const { bookRequestId } = req.params;
      const { status } = req.body; // status -> PENDING, APPROVE, REJECT,
      const request = await BookLoanRequestModel.findOne({ _id: bookRequestId })

      if (request) {
        const updated = await BookLoanRequestModel
          .findOneAndUpdate({ _id: bookRequestId }, { status }, { new: true });

        return res.status(200).send(response.success('Update book request', updated));
      }
      return res.status(200).send(response.success('Request not found', {}, false));
    } catch (e) {
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async bookRequests(req, res) {
    try {
      const { userId } = req.params; // userId
      const request = await BookLoanRequestModel.aggregate([
        { $match: { userId: ObjectId(userId), status: bookRequestStatus.pending } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: 'books',
            localField: 'bookId',
            foreignField: '_id',
            as: 'book',
          },
        },
        { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            requestDate: 1,
            taskDate: 1,
            status: 1,
            bookId: 1,
            userId: 1,
            'user.name': 1,
            'user.mobile': 1,
            'user.email': 1,
            'user.image': 1,
            'book.title': 1,
            'book.authorName': 1,
            'book.bookType': 1,
            'book.publications': 1,

          },
        },
      ]);
      return res.status(200).send(response.success('Requested books', request));
    } catch (e) {
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },
};
