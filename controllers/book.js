const XLSX = require('xlsx');
const fs = require('fs');
const { ObjectId } = require('mongoose').Types;
const { bookRequestStatus } = require('../config/constants');
const { BookModel } = require('../models/book');
const { BookLoanRequestModel } = require('../models/bookLoanRequest');
const { BookLoanModel } = require('../models/bookLoan');
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
      const { authorId } = req.query;
      const perPage = 20;
      const skip = perPage * (pageNo - 1);
      const limit = skip + perPage;
      let books;
      if (authorId) {
        books = await BookModel.aggregate([
          { $match: { authorId: ObjectId(authorId) } },
          {
            $lookup: {
              from: 'users',
              localField: 'authorId',
              foreignField: '_id',
              as: 'author',
            },
          },
          { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
          {
            $project: {
              title: 1,
              bookType: 1,
              authorId: 1,
              publications: 1,
              'author.name': 1,
              'author.mobile': 1,
              'author.email': 1,
              'author.image': 1,
            },
          },
        ]).skip(skip).limit(limit);
      } else {
        books = await BookModel.aggregate([
          {
            $lookup: {
              from: 'users',
              localField: 'authorId',
              foreignField: '_id',
              as: 'author',
            },
          },
          { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
          {
            $project: {
              title: 1,
              bookType: 1,
              authorId: 1,
              publications: 1,
              'author.name': 1,
              'author.mobile': 1,
              'author.email': 1,
              'author.image': 1,
            },
          },
        ]).skip(skip).limit(limit);
      }
      return res.status(200).send(response.success('Book lists', books));
    } catch (e) {
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  /**
   * Request for a new book
   * @param req
   * @param res
   * @returns {Promise<*|void>}
   */
  async requestForBook(req, res) {
    try {
      const payload = req.body; // bookId, userId
      const checkRequest = await BookLoanRequestModel
        .findOne({
          userId: payload.userId,
          bookId: payload.bookId,
          status: bookRequestStatus.pending,
        });

      if (checkRequest) {
        return res.status(200).send(response.success('This book is already requested for loan', {}, false));
      }

      const request = await BookLoanRequestModel.create(payload);
      return res.status(200).send(response.success('New book request created', request));
    } catch (e) {
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  /**
   * Approve/ Reject book request
   * @param req
   * @param res
   * @returns {Promise<*|void>}
   */
  async updateBookRequest(req, res) {
    try {
      const { bookRequestId } = req.params;
      const { status } = req.body; // status -> PENDING, APPROVE, REJECT,
      const request = await BookLoanRequestModel.findOne({ _id: bookRequestId });

      if (request) {
        const updated = await BookLoanRequestModel
          .findOneAndUpdate({ _id: bookRequestId }, { status }, { new: true });

        if (status === bookRequestStatus.approve) {
          await BookLoanModel.create({
            userId: request.userId,
            bookId: request.bookId,
            loanDate: new Date(),
            isReturned: false,
          });
        }
        return res.status(200).send(response.success('Update book request', updated));
      }
      return res.status(200).send(response.success('Loan request not found', {}, false));
    } catch (e) {
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  /**
   * Fetch all pending book requested
   * @param req
   * @param res
   * @returns {Promise<*|void>}
   */
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
            let: { bookId: '$bookId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$bookId'] } } },
              {
                $lookup: {
                  from: 'users',
                  let: { authorId: '$authorId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$authorId'] } } },
                    {
                      $project: {
                        _id: 1, name: 1, image: 1, mobile: 1, email: 1,
                      },
                    },
                  ],
                  as: 'author',
                },
              },
              { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
              {
                $project: {
                  title: 1, publications: 1, bookType: 1, author: '$author',
                },
              },
            ],
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
            'book.bookType': 1,
            'book.publications': 1,
            'book.author': 1,

          },
        },
      ]);
      return res.status(200).send(response.success('Requested books', request));
    } catch (e) {
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  /**
   * Get list of book loans
   * @param req
   * @param res
   * @returns {Promise<*|void>}
   */
  async getBookLoans(req, res) {
    try {
      const { userId } = req.params; // userId
      const books = await BookLoanModel.aggregate([
        { $match: { userId: ObjectId(userId), isReturned: false } },
        {
          $lookup: {
            from: 'books',
            let: { bookId: '$bookId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$bookId'] } } },
              {
                $lookup: {
                  from: 'users',
                  let: { authorId: '$authorId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$authorId'] } } },
                    {
                      $project: {
                        _id: 1, name: 1, image: 1, mobile: 1, email: 1,
                      },
                    },
                  ],
                  as: 'author',
                },
              },
              { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
              {
                $project: {
                  title: 1, publications: 1, bookType: 1, author: '$author',
                },
              },
            ],
            as: 'book',
          },
        },
        { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            loanDate: 1,
            isReturned: 1,
            bookId: 1,
            userId: 1,
            'book.title': 1,
            'book.bookType': 1,
            'book.publications': 1,
            'book.author': 1,

          },
        },
      ]);
      return res.status(200).send(response.success('Loan books', books));
    } catch (e) {
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  /**
   * Generate Excel report for all type of Book loans
   * @param req
   * @param res
   * @returns {Promise<*|void>}
   */
  async generateBookLoansExcel(req, res) {
    try {
      const books = await BookLoanModel.aggregate([
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
            let: { bookId: '$bookId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$bookId'] } } },
              {
                $lookup: {
                  from: 'users',
                  let: { authorId: '$authorId' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$authorId'] } } },
                    {
                      $project: {
                        _id: 1, name: 1, image: 1, mobile: 1, email: 1,
                      },
                    },
                  ],
                  as: 'author',
                },
              },
              { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
              {
                $project: {
                  title: 1, publications: 1, bookType: 1, author: '$author',
                },
              },
            ],
            as: 'book',
          },
        },
        { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            loanDate: 1,
            isReturned: 1,
            returnedAt: 1,
            bookTitle: '$book.title',
            authorName: '$book.author.name',
            authorMobile: '$book.author.mobile',
            bookType: '$book.bookType',
            publications: '$book.publications',
            userName: '$user.name',
            userEmail: '$user.email',
            userMobile: '$user.mobile',
          },
        },
      ]);

      /* make the worksheet */
      const ws = XLSX.utils.json_to_sheet(books);

      /* add to workbook */
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'BookLoans');

      /* write workbook */
      const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' }); // generate a nodejs buffer

      fs.writeFile('book-loans.xls', buf, (err) => {
        if (err) console.log(err);
      });

      return res.status(200).send(response.success('Book loans excel sheet generate succesfully', {}));
    } catch (e) {
      console.error(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  /**
   * Return book and update status for loan book with return date
   * @param req
   * @param res
   * @returns {Promise<*|void>}
   */
  async returnBook(req, res) {
    try {
      const { userId, bookId } = req.params; // userId, bookId

      const returnedBook = await BookLoanModel
        .findOneAndUpdate(
          { userId, bookId, isReturned: false },
          { isReturned: true, returnedAt: new Date() },
          { new: true },
        );

      return res.status(200).send(response.success('Returned book', returnedBook));
    } catch (e) {
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },
};
